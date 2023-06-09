import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class StudwellingtonPlanitia extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.STUDWELLINGTON_PLANITIA,
      tags: [Tag.VENUS],
      cost: 18,
      victoryPoints: {tag: Tag.VENUS},

      metadata: {
        cardNumber: '262',
        renderData: CardRenderer.builder((b) => {
          b.vpText('1 VP per Venus tag you have.');
        }),
        description: 'STUDWELLINGTON PLANITIA',
      },
    });
  }
}
