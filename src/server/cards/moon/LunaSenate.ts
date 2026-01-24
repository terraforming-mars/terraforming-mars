import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';

export class LunaSenate extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_SENATE,
      type: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.MOON],
      cost: 32,
      victoryPoints: {tag: Tag.MOON},

      behavior: {
        production: {megacredits: {tag: Tag.MOON, others: true}},
        // production: {megacredits: {tag: Tag.MOON, all: true}},
      },

      requirements: {tag: Tag.MOON, count: 3},
      metadata: {
        // description: 'Requires that you have 3 Moon tags. Increase your M€ production 1 step per Moon tag in the game (including these.)',
        description: 'Requires that you have 3 Moon tags. Increase your M€ production 1 step per Moon tag your OPPONENTS have.',
        cardNumber: 'M70',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().tag(Tag.MOON, {all}).asterix()).br;
          b.vpText('1 VP per Moon tag you have.');
        }),
      },
    });
  }
}
