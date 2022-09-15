import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';

export class LunaMiningHub extends Card {
  constructor() {
    super({
      name: CardName.LUNA_MINING_HUB,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 16,
      reserveUnits: {steel: 1, titanium: 1},

      behavior: {
        production: {steel: 1, titanium: 1},
        // TODO(kberg): mining rate ought to occur after tile is placed.
        moon: {
          tile: {type: TileType.LUNA_MINING_HUB, title: 'Select a space for Luna Mining Hub.'},
          miningRate: 1,
        },
      },

      victoryPoints: 'special',
      requirements: CardRequirements.builder((b) => b.miningRate(5)),

      metadata: {
        cardNumber: 'M14',
        description: {
          text: '2 VP PER MINING TILE ADJACENT TO THIS TILE.',
          align: 'left',
        },
        renderData: CardRenderer.builder((b) => {
          b.text('Requires a Mining Rate of 5 or higher.', Size.TINY, false, false).br;
          b.minus().steel(1).minus().titanium(1).production((pb) => pb.steel(1).titanium(1)).br;
          b.text('Spend 1 steel and 1 titanium and raise your steel and titanium production 1 step.', Size.TINY, false, false).br;
          b.tile(TileType.LUNA_MINING_HUB, true).moonMiningRate({size: Size.SMALL});
          b.text('Place this tile on The Moon and raise the Mining Rate 1 step.', Size.TINY, false, false);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.moonMiningTile(2, true),
      },
    });
  }

  public override getVictoryPoints(player: Player) {
    const moonData = MoonExpansion.moonData(player.game);
    const usedSpace = moonData.moon.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(usedSpace);
      const adjacentMines = adjacentSpaces.filter((s) => MoonExpansion.spaceHasType(s, TileType.MOON_MINE));
      return 2 * adjacentMines.length;
    }
    return 0;
  }
}
