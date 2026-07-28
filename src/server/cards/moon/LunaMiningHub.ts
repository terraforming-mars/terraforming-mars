import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {moonMiningTile} from '../render/DynamicVictoryPoints';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';

export class LunaMiningHub extends Card {
  constructor() {
    super({
      name: CardName.LUNA_MINING_HUB,
      type: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 23,
      reserveUnits: {steel: 1, titanium: 1},

      behavior: {
        production: {steel: 1, titanium: 1},
        // TODO(kberg): mining rate ought to occur after tile is placed.
        moon: {
          tile: {type: TileType.LUNA_MINING_HUB},
          miningRate: 1,
        },
      },

      victoryPoints: {moon: {mine: {}}, nextToThis: {}, each: 2},
      requirements: {miningRate: 5},

      metadata: {
        cardNumber: 'M14',
        renderData: CardRenderer.builder((b) => {
          b.text('Requires a mining rate of 5 or higher.', {size: Size.TINY, isBold: false}).br;
          b.minus().steel(1).minus().titanium(1).production((pb) => pb.steel(1).titanium(1)).br;
          b.text('Spend 1 steel and 1 titanium and raise your steel and titanium production 1 step.', {size: Size.TINY, isBold: false}).br;
          b.tile(TileType.LUNA_MINING_HUB, true).moonMiningRate({size: Size.SMALL});
          b.text('Place this tile on The Moon and raise the mining rate 1 step.', {size: Size.TINY, isBold: false}).br;
          b.vpText('2 VP PER MINING TILE ADJACENT TO THIS TILE.');
        }),
        victoryPoints: moonMiningTile(2, true),
      },
    });
  }
}
