import {IProjectCard} from '../IProjectCard';
import {IActionCard, ICard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {LogHelper} from '../../LogHelper';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardRenderer} from '../render/CardRenderer';

export class BioPrintingFacility extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BIO_PRINTING_FACILITY,
      tags: [Tags.BUILDING],
      cost: 7,

      metadata: {
        cardNumber: 'X36',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 energy to gain 2 plants OR to add 1 animal to ANOTHER card.', (eb) => {
            eb.energy(2).digit.startAction.plants(2);
            eb.or().animals(1).asterix();
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.energy >= 2;
  }

  public action(player: Player) {
    const availableAnimalCards = player.getResourceCards(ResourceType.ANIMAL);
    player.energy -= 2;

    if (availableAnimalCards.length === 0) {
      player.plants += 2;
      LogHelper.logGainStandardResource(player, Resources.PLANTS, 2);
      return undefined;
    }

    const gainPlantOption = new SelectOption('Gain 2 plants', 'Gain plants', () => {
      player.plants += 2;
      LogHelper.logGainStandardResource(player, Resources.PLANTS, 2);
      return undefined;
    });

    if (availableAnimalCards.length === 1) {
      const targetCard = availableAnimalCards[0];

      return new OrOptions(
        new SelectOption('Add 1 animal to ' + targetCard.name, 'Add animal', () => {
          player.addResourceTo(targetCard);
          LogHelper.logAddResource(player, targetCard);
          return undefined;
        }),
        gainPlantOption,
      );
    }

    return new OrOptions(
      new SelectCard(
        'Select card to add 1 animal',
        'Add animal',
        availableAnimalCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0]);
          LogHelper.logAddResource(player, foundCards[0]);
          return undefined;
        },
      ),
      gainPlantOption,
    );
  }
}
