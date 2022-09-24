import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LunarBeam extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LUNAR_BEAM,
      tags: [Tag.EARTH, Tag.ENERGY],
      cost: 13,

      behavior: {
        production: {megacredits: -2, heat: 2, energy: 2},
      },

      metadata: {
        cardNumber: '030',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().heat(2).br;
            pb.plus().energy(2);
          });
        }),
        description: 'Decrease your M€ production 2 steps and increase your heat production and energy production 2 steps each.',
      },
    });
  }
}
