import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class ArtificialPhotosynthesis extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ARTIFICIAL_PHOTOSYNTHESIS,
      tags: [Tag.SCIENCE],
      cost: 12,

      behavior: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              production: {energy: 2},
              title: 'Increase your energy production 2 steps',
            },
            {
              production: {plants: 1},
              title: 'Increase your plant production 1 step',
            },
          ],
        },
      },

      metadata: {
        description: 'Increase your plant production 1 step or your energy production 2 steps.',
        cardNumber: '115',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(1).or(Size.SMALL).energy(2))),
      },
    });
  }
}
