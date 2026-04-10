import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {moonRoadTile} from '../render/DynamicVictoryPoints';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';

export class LunaTrainStation extends Card {
  constructor() {
    super({
      name: CardName.LUNA_TRAIN_STATION,
      type: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 24,
      reserveUnits: {steel: 2},
      victoryPoints: {moon: {road: {}}, nextToThis: {}, each: 2},

      behavior: {
        production: {megacredits: 4},
        moon: {
          tile: {type: TileType.LUNA_TRAIN_STATION},
          logisticsRate: 1,
        },
      },

      requirements: {logisticRate: 5},

      metadata: {
        description: 'Requires a logistic rate of 5 or higher. Spend 2 steel. ' +
        'Increase your M€ production 4 steps. Place this tile on The Moon and raise the logistic rate 1 step. ' +
        '2 VP FOR EACH ROAD TILE ADJACENT TO THIS TILE.',
        cardNumber: 'M15',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(2, {digit});
          b.production((pb) => pb.megacredits(4));
          b.tile(TileType.LUNA_TRAIN_STATION, true).moonLogisticsRate();
        }),
        victoryPoints: moonRoadTile(2, true),
      },
    });
  }
}
