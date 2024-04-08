import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class ImportedHeavyMachinery extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.IMPORTED_HEAVY_MACHINERY,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 9,

      behavior: {
        underworld: {excavate: 2},
      },

      metadata: {
        cardNumber: 'U21',
        renderData: CardRenderer.builder((b) => {
          b.excavate(2);
        }),
        description: 'Excavate 2 underground resources.',
      },
    });
  }
}
