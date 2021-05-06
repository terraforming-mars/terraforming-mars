import {ICard, IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
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

export class ExtremeColdFungus extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EXTREME_COLD_FUNGUS,
      tags: [Tags.MICROBE],
      cost: 13,

      requirements: CardRequirements.builder((b) => b.temperature(-10).max()),
      metadata: {
        cardNumber: '134',
        description: 'It must be -10 C or colder.',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 plant.', (eb) => {
            eb.empty().startAction.plants(1);
          }).br;
          b.or().br;
          b.action('Add 2 microbes to ANOTHER card.', (eb) => {
            eb.empty().startAction.microbes(2).asterix();
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const otherMicrobeCards = player.getResourceCards(ResourceType.MICROBE);

    if (otherMicrobeCards.length === 0) {
      player.plants++;
      LogHelper.logGainStandardResource(player, Resources.PLANTS);
      return undefined;
    }

    const gainPlantOption = new SelectOption('Gain 1 plant', 'Gain plant', () => {
      player.plants++;
      LogHelper.logGainStandardResource(player, Resources.PLANTS);
      return undefined;
    });

    if (otherMicrobeCards.length === 1) {
      const targetCard = otherMicrobeCards[0];

      return new OrOptions(
        new SelectOption('Add 2 microbes to ' + targetCard.name, 'Add microbes', () => {
          player.addResourceTo(targetCard, {qty: 2, log: true});
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
          player.addResourceTo(foundCards[0], {qty: 2, log: true});
          return undefined;
        },
      ),
      gainPlantOption,
    );
  }
}
