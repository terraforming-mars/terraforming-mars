import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class SinusIrdiumRoadNetwork extends Card {
  constructor() {
    super({
      name: CardName.SINUS_IRDIUM_ROAD_NETWORK,
      type: CardType.AUTOMATED,
      tags: [Tag.MOON],
      cost: 15,

      behavior: {
        production: {energy: -1, megacredits: 3},
        moon: {
          roadTile: {},
        },
      },
      reserveUnits: {steel: 1},

      metadata: {
        description: 'Decrease your energy production 1 step and increase your M€ production 3 steps. ' +
          'Spend 1 steel. ' +
          'Place a road tile on The Moon and raise the Logistics Rate 1 step.',
        cardNumber: 'M11',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).nbsp.plus().megacredits(3);
          }).br;
          b.minus().steel(1).br;
          b.moonRoad({secondaryTag: AltSecondaryTag.MOON_LOGISTICS_RATE});
        }),
      },
    });
  }
}
