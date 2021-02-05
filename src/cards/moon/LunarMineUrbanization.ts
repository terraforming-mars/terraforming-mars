import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';

export class LunarMineUrbanization extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_MINE_URBANIZATION,
      cardType: CardType.EVENT,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 8,
      productionBox: Units.of({megacredits: 1}),
      requirements: CardRequirements.builder((b) => {
        // TODO(kberg): distinguish between any mining tile and your mining tile.
        b.miningTiles(1);
      }),
      metadata: {
        description: 'Requires you have 1 mine tile. Increase your MC production 1 step. Replace one of your mine tiles ' +
        'with this special tile. Raise Colony Rate 1 step. This tile counts both as a colony and a mine tile.',
        cardNumber: 'M55',

        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.moonColonyRate(1);
          b.tile(TileType.LUNAR_MINE_URBANIZATION, false).asterix();
        }),
      },
    });
  };

  private static myMineTiles(player: Player): Array<ISpace> {
    return MoonExpansion.tiles(player.game, TileType.MOON_MINE, false).filter((space) => space.player?.id === player.id);
  }

  // NOTE(kberg): Rules were that it says it Requires 1 mine tile. Changing to "Requires you have 1 mine tile."
  public canPlay(player: Player): boolean {
    return LunarMineUrbanization.myMineTiles(player).length >= 1;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    const tiles = LunarMineUrbanization.myMineTiles(player);
    return new SelectSpace('Select one of your mines to upgrade', tiles, (space) => {
      if (space.tile === undefined) {
        throw new Error(`Space ${space.id} should have a tile, how doesn't it?`);
      }
      space.tile.tileType = TileType.LUNAR_MINE_URBANIZATION;
      MoonExpansion.raiseColonyRate(player);
      return undefined;
    });
  }
}
