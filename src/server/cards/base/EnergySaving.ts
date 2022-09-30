import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class EnergySaving extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ENERGY_SAVING,
      tags: [Tag.ENERGY],
      cost: 15,

      behavior: {
        production: {energy: {cities: {}}},
      },

      metadata: {
        cardNumber: '189',
        description: 'Increase your energy production 1 step for each City tile in play.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).slash().city({size: Size.SMALL, all}));
        }),
      },
    });
  }
}
