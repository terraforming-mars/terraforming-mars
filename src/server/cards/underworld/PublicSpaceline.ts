import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {Tag} from '../../../common/cards/Tag';

export class PublicSpaceline extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PUBLIC_SPACELINE,
      cost: 18,
      tags: [Tag.EARTH, Tag.EARTH, Tag.JOVIAN, Tag.JOVIAN, Tag.VENUS, Tag.VENUS, Tag.MARS, Tag.MARS],

      requirements: {tag: Tag.SPACE, count: 5},

      metadata: {
        cardNumber: 'U77',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).br;
          b.earth(1, {played}).earth(1, {played}).jovian().jovian().br;
          b.venus(1, {played}).venus(1, {played}).mars(1, {played}).mars(1, {played});
        }),
        description: 'Requires 5 space tags. This card has 2 Earth tags, 2 Jovian tags, 2 Venus tags, and 2 Mars tags.',
      },
    });
  }
}
