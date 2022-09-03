import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class BioPrintingFacility extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BIO_PRINTING_FACILITY,
      tags: [Tag.BUILDING],
      cost: 7,

      metadata: {
        cardNumber: 'X36',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 energy to gain 2 plants OR to add 1 animal to ANOTHER card.', (eb) => {
            eb.energy(2, {digit}).startAction.plants(2);
            eb.or().animals(1).asterix();
          });
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.energy >= 2;
  }

  public action(player: Player) {
    const availableAnimalCards = player.getResourceCards(CardResource.ANIMAL);
    player.deductResource(Resources.ENERGY, 2);


    if (availableAnimalCards.length === 0) {
      player.addResource(Resources.PLANTS, 2, {log: true});
      return undefined;
    }

    const gainPlantOption = new SelectOption('Gain 2 plants', 'Gain plants', () => {
      player.addResource(Resources.PLANTS, 2, {log: true});
      return undefined;
    });

    if (availableAnimalCards.length === 1) {
      const targetCard = availableAnimalCards[0];

      return new OrOptions(
        new SelectOption('Add 1 animal to ' + targetCard.name, 'Add animal', () => {
          player.addResourceTo(targetCard, {log: true});
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
        ([card]) => {
          player.addResourceTo(card, {log: true});
          return undefined;
        },
      ),
      gainPlantOption,
    );
  }
}
