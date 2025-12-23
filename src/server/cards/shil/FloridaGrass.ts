import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class FloridaGrass extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FLORIDA_GRASS,
      tags: [Tag.EARTH],
      cost: 28,

      victoryPoints: {tag: Tag.EARTH, per: 1},

      metadata: {
        cardNumber: 'SH011',
        description: 'Nobody can chip in the florida grass',
        renderData: CardRenderer.builder((b) => {
          b.vpText('1 VP per earth tag you have.');
        }),
      },
    });
  }
}

