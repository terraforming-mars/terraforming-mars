import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeLake extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MOHOLE_LAKE,
      tags: [Tag.BUILDING],
      cost: 31,

      behavior: {
        stock: {plants: 3},
        global: {temperature: 1},
        ocean: {},
      },

      metadata: {
        cardNumber: 'X27',
        renderData: CardRenderer.builder((b) => {
          b.action('Add a microbe or animal to ANOTHER card.', (eb) => {
            eb.empty().startAction.microbes(1).asterix();
            eb.nbsp.or().nbsp.animals(1).asterix();
          }).br;
          b.plants(3).temperature(1).oceans(1);
        }),
        description: 'Gain 3 plants. Raise temperature 1 step, and place 1 ocean tile.',
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const availableCards = player.getResourceCards(CardResource.MICROBE).concat(player.getResourceCards(CardResource.ANIMAL));

    if (availableCards.length === 0) {
      return undefined;
    }

    if (availableCards.length === 1) {
      player.addResourceTo(availableCards[0], {log: true});
      return undefined;
    }

    return new SelectCard('Select card to add microbe or animal', 'Add resource', availableCards, ([card]) => {
      player.addResourceTo(card, {log: true});
      return undefined;
    });
  }
}
