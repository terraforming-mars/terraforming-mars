import {ISpace} from '../boards/ISpace';
import {Game} from '../Game';
import {LogHelper} from '../LogHelper';
import {Phase} from '../Phase';
import {Player} from '../Player';
import {TileType} from '../TileType';
import {IAresData, IHazardConstraint} from './IAresData';

/**
 * Package-private support for placing and upgrading hazard tiles.
 */
export class _AresHazardPlacement {
  public static putHazardAt(space: ISpace, tileType: TileType) {
    space.tile = {tileType: tileType, protectedHazard: false};
  }

  public static randomlyPlaceHazard(game: Game, tileType: TileType, direction: 1 | -1) {
    const space = game.getSpaceByOffset(direction, tileType);
    this.putHazardAt(space, tileType);
    return space;
  }

  public static makeSevere(game: Game, from: TileType, to: TileType) {
    game.board.spaces
      .filter((s) => s.tile?.tileType === from)
      .forEach((s) => {
        if (s.tile !== undefined) {
          s.tile.tileType = to;
        }
      });

    game.log('${0} have upgraded to ${1}', (b) => b.string(TileType.toString(from)).string(TileType.toString(to)));
  }

  public static onTemperatureChange(game: Game, aresData: IAresData) {
    // This will have no effect if the erosions don't exist, but that's OK --
    // the check for placing erosions will take this into account.
    this.testConstraint(
      aresData.hazardData.severeErosionTemperature,
      game.getTemperature(),
      () => {
        this.makeSevere(game, TileType.EROSION_MILD, TileType.EROSION_SEVERE);
      },
    );
  }

  public static onOceanPlaced(aresData: IAresData, player: Player) {
    this.testToPlaceErosionTiles(aresData, player);
    this.testToRemoveDustStorms(aresData, player);
  }

  public static onOxygenChange(game: Game, aresData: IAresData) {
    this.testConstraint(aresData.hazardData.severeDustStormOxygen, game.getOxygenLevel(), () => {
      this.makeSevere(game, TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE);
    });
  }

  private static testToPlaceErosionTiles(aresData: IAresData, player: Player) {
    if (player.game.gameOptions.aresHazards === false) {
      return;
    }

    this.testConstraint(
      aresData.hazardData.erosionOceanCount,
      player.game.board.getOceansOnBoard(),
      () => {
        let type = TileType.EROSION_MILD;
        if (aresData.hazardData.severeErosionTemperature.available !== true) {
          type = TileType.EROSION_SEVERE;
        }

        const space1 = this.randomlyPlaceHazard(player.game, type, 1);
        const space2 = this.randomlyPlaceHazard(player.game, type, -1);
        [space1, space2].forEach((space) => {
          LogHelper.logTilePlacement(player, space, type);
        });
      },
    );
  }

  private static testToRemoveDustStorms(aresData: IAresData, player: Player) {
    this.testConstraint(
      aresData.hazardData.removeDustStormsOceanCount,
      player.game.board.getOceansOnBoard(),
      () => {
        player.game.board.spaces.forEach((space) => {
          if (space.tile?.tileType === TileType.DUST_STORM_MILD || space.tile?.tileType === TileType.DUST_STORM_SEVERE) {
            if (space.tile.protectedHazard !== true) {
              space.tile = undefined;
            }
          }
        });

        if (player.game.phase !== Phase.SOLAR) {
          player.increaseTerraformRating();
          player.game.log('${0}\'s TR increases 1 step for eliminating dust storms.', (b) => b.player(player));
        }
      },
    );
  }

  private static testConstraint(constraint: IHazardConstraint, testValue: number, cb: () => void) {
    if (!constraint.available) {
      return;
    }
    if (testValue >= constraint.threshold) {
      cb();
      constraint.available = false;
    }
  }
}
