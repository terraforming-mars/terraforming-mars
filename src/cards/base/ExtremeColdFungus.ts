import {ICard, IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class ExtremeColdFungus extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EXTREME_COLD_FUNGUS,
      tags: [Tags.MICROBE],
      cost: 13,

      metadata: {
        cardNumber: '134',
        description: 'It must be -10 C or colder.',
        requirements: CardRequirements.builder((b) => b.temperature(-10).max()),
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.empty().startAction.plants(1);
            eb.description('Action: Gain 1 plant.');
          }).br;
          b.or().br;
          b.effectBox((eb) => {
            eb.empty().startAction.microbes(2).asterix();
            eb.description('Action: Add 2 microbes to ANOTHER card.');
          });
        }),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.TEMPERATURE, -10);
  }
  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player, game: Game) {
    const otherMicrobeCards = player.getResourceCards(ResourceType.MICROBE);

    if (otherMicrobeCards.length === 0) {
      player.plants++;
      LogHelper.logGainStandardResource(game, player, Resources.PLANTS);
      return undefined;
    }

    const gainPlantOption = new SelectOption('Gain 1 plant', 'Gain plant', () => {
      player.plants++;
      LogHelper.logGainStandardResource(game, player, Resources.PLANTS);
      return undefined;
    });

    if (otherMicrobeCards.length === 1) {
      const targetCard = otherMicrobeCards[0];

      return new OrOptions(
        new SelectOption('Add 2 microbes to ' + targetCard.name, 'Add microbes', () => {
          player.addResourceTo(targetCard, 2);
          LogHelper.logAddResource(game, player, targetCard, 2);
          return undefined;
        }),
        gainPlantOption,
      );
    }

    return new OrOptions(
      new SelectCard(
        'Select card to add 2 microbes',
        'Add microbes',
        otherMicrobeCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 2);
          LogHelper.logAddResource(game, player, foundCards[0], 2);
          return undefined;
        },
      ),
      gainPlantOption,
    );
  }
}
