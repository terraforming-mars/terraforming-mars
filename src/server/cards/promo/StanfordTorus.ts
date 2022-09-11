import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class StanfordTorus extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.STANFORD_TORUS,
      tags: [Tag.SPACE, Tag.CITY],
      cost: 12,
      victoryPoints: 2,

      behavior: {
        city: {space: SpaceName.STANFORD_TORUS, type: SpaceType.COLONY},
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
