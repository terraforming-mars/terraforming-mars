import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';

export class SoilExport extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SOIL_EXPORT,
      type: CardType.AUTOMATED,
      cost: 3,
      tags: [Tag.VENUS, Tag.SPACE],
      victoryPoints: -1,

      behavior: {
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 3},
        underworld: {excavate: 1},
      },


      metadata: {
        cardNumber: 'U058',
        renderData: CardRenderer.builder((b) => {
          b.excavate().resource(CardResource.FLOATER, 3).br;
          b.plainText('Excavate an underground resource. Add 3 floaters to any card').br;
        }),
      },
    });
  }
}
