import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardResource} from '@/common/CardResource';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {digit} from '@/server/cards/Options';

export class ImportedNutrients extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.IMPORTED_NUTRIENTS,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 14,

      behavior: {
        stock: {plants: 4},
        addResourcesToAnyCard: {count: 4, type: CardResource.MICROBE},
      },

      metadata: {
        cardNumber: 'X22',
        renderData: CardRenderer.builder((b) => {
          b.plants(4, {digit}).nbsp.resource(CardResource.MICROBE, {amount: 4, digit}).asterix();
        }),
        description: 'Gain 4 plants and add 4 microbes to ANOTHER CARD.',
      },
    });
  }
}
