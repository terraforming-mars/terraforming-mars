import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class LunarMining extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tag.EARTH],
      name: CardName.LUNAR_MINING,
      type: CardType.AUTOMATED,

      behavior: {
        production: {titanium: {tag: Tag.EARTH, per: 2}},
      },

      metadata: {
        cardNumber: 'C22',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.titanium(1).slash().tag(Tag.EARTH, 2);
          });
        }),
        description: 'Increase your titanium production 1 step for every 2 Earth tags you have in play, including this.',
      },
    });
  }
}
