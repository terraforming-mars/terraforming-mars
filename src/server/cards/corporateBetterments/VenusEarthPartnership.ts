import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class VenusEarthPartnership extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.VENUS_EARTH_PARTNERSHIP,
      tags: [Tag.EARTH, Tag.VENUS],
      cost: 16,
      victoryPoints: 5,
      requirements: [{tag: Tag.EARTH, count: 3}, {tag: Tag.VENUS, count: 3}],
      metadata: {
        cardNumber: 'B48',
        description: 'Requires 3 Earth tags and 3 Venus tags.',
        renderData: CardRenderer.builder((b) => {
          b.vpText('5 VP.');
        }),
      },
    });
  }
}
