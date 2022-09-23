import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class GalileanWaystation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 15,
      tags: [Tag.SPACE],
      name: CardName.GALILEAN_WAYSTATION,
      cardType: CardType.AUTOMATED,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: {tag: Tag.JOVIAN, all: true}},
      },

      metadata: {
        description: 'Increase your M€ production 1 step for every Jovian tag in play.',
        cardNumber: 'C13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().jovian({played, all}));
        }),
      },
    });
  }
}
