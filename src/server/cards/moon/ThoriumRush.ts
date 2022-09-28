import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

// TODO(kberg): Add a test for how this card operates with Reds. It will be a good verification.
export class ThoriumRush extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.THORIUM_RUSH,
      cardType: CardType.EVENT,
      tags: [Tag.MOON, Tag.BUILDING],
      cost: 39,

      behavior: {
        moon: {
          habitatTile: {},
          mineTile: {},
          roadTile: {},
        },
      },

      metadata: {
        description: 'Place 1 habitat tile, 1 mining tile and 1 road tile on The Moon. ' +
        'Raise the Habitat Rate, Mining Rate and Logistic Rate 1 step.',
        cardNumber: 'M56',
        renderData: CardRenderer.builder((b) => {
          b.moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE})
            .moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE})
            .moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
        }),
      },
    });
  }
}
