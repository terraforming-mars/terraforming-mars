import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit, played} from '../Options';

export class GrandLunaAcademy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GRAND_LUNA_ACADEMY,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON],
      cost: 13,

      behavior: {
        drawCard: {count: {tag: Tag.MOON, per: 2}},
      },

      metadata: {
        description: 'Draw 1 card per 2 Moon tags you have, including this.',
        cardNumber: 'M83',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).slash().moon(2, {digit, played});
        }),
      },
    });
  }
}
