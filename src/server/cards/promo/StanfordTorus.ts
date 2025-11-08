import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../../common/boards/SpaceName';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class StanfordTorus extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.STANFORD_TORUS,
      tags: [Tag.SPACE, Tag.CITY],
      cost: 12,
      victoryPoints: 2,

      behavior: {
        city: {space: SpaceName.STANFORD_TORUS},
      },

      metadata: {
        cardNumber: 'X12',
        renderData: CardRenderer.builder((b) => {
          b.city().asterix();
        }),
        description: 'Place a city tile IN SPACE, outside and separate from the planet.',
      },
    });
  }
}
