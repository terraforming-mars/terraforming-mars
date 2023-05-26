import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {all, played} from '../Options';

export class Caracals extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CARACALS,
      tags: [Tag.ANIMAL],
      cost: 10,

      behavior: {
        stock: {megacredits: {tag: Tag.ANIMAL, all: true}},
        addResourcesToAnyCard: {count: 2, type: CardResource.ANIMAL},
      },

      metadata: {
        cardNumber: 'N60',
        description: '1M€ for each animal tag in play, including this. Add 2 animals to ANOTHER card.',
        renderData: CardRenderer.builder((b) => {   
          b.megacredits(1).slash().animals(1, {all, played}).br;
          b.animals(2).asterix();
        }),
      },
    });
  }
}
