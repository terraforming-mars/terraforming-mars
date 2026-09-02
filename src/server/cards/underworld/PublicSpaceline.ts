import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class PublicSpaceline extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PUBLIC_SPACELINE,
      cost: 18,
      tags: [Tag.EARTH, Tag.EARTH, Tag.JOVIAN, Tag.JOVIAN, Tag.VENUS, Tag.VENUS, Tag.MARS, Tag.MARS],

      requirements: {tag: Tag.SPACE, count: 5},

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'U077',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).plainText('Increase your M€ production 2 steps.', true).br;
          b.tag(Tag.EARTH, {amount: 2, digit}).tag(Tag.JOVIAN, {amount: 2, digit});
          b.tag(Tag.VENUS, {amount: 2, digit}).tag(Tag.MARS, {amount: 2, digit});
        }),
        description: 'Requires 5 space tags. This card has 2 Earth tags, 2 Jovian tags, 2 Venus tags, and 2 Mars tags.',
      },
    });
  }
}
