import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class SulphurExports extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SULPHUR_EXPORTS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.SPACE],
      cost: 21,

      behavior: {
        global: {venus: 1},
        production: {megacredits: {tag: Tag.VENUS}},
      },

      metadata: {
        cardNumber: '250',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.megacredits(1).slash().venus(1, {played}));
        }),
        description: 'Increase Venus 1 step. Increase your M€ production 1 step for each Venus tag you have, including this.',
      },
    });
  }
}
