import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class TychoRoadNetwork extends Card {
  constructor() {
    super({
      name: CardName.TYCHO_ROAD_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON],
      cost: 15,

      behavior: {
        production: {megacredits: 1},
        moon: {
          roadTile: {},
        },
      },
      reserveUnits: {steel: 1},

      metadata: {
        description: 'Spend 1 steel. Increase your M€ production 1 step. ' +
        'Place a road tile on The Moon and raise the Logistics Rate 1 step.',
        cardNumber: 'M09',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).br;
          b.production((eb) => eb.megacredits(1)).br;
          b.moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
        }),
      },
      tilesBuilt: [TileType.MOON_ROAD],
    });
  }
}
