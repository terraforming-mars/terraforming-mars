import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class MiningExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.MINING_EXPEDITION,
      cost: 12,

      behavior: {
        stock: {steel: 2},
        global: {oxygen: 1},
        removeAnyPlants: 2,
      },

      metadata: {
        cardNumber: '063',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).br;
          b.minus().plants(-2, {all});
          b.steel(2);
        }),
        description: 'Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.',
      },
    });
  }
}
