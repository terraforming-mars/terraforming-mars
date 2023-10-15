import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class MartianRails extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_RAILS,
      tags: [Tag.BUILDING],
      cost: 13,

      action: {
        spend: {energy: 1},
        stock: {megacredits: {cities: {where: 'onmars'}}},
      },

      metadata: {
        cardNumber: '007',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to gain 1 M€ for each city tile ON MARS.', (eb) => {
            eb.energy(1).startAction.megacredits(1).slash();
            eb.city({all, size: Size.SMALL}).asterix();
          }).br;
        }),
      },
    });
  }
}
