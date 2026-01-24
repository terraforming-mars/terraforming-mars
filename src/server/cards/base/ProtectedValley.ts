import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ProtectedValley extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PROTECTED_VALLEY,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 23,

      behavior: {
        production: {megacredits: 2},
        greenery: {on: 'ocean'},
      },

      metadata: {
        cardNumber: '174',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp;
          b.greenery().asterix();
        }),
        description: 'Increase your M€ production 2 steps. Place a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.',
      },
    });
  }
}
