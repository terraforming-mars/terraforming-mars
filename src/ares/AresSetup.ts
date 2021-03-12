import {Player} from '../Player';
import {IAresData} from './IAresData';
import {Game} from '../Game';
import {TileType} from '../TileType';
import {_AresHazardPlacement} from './AresHazards';

export class AresSetup {
  private constructor() {}

  public static initialData(active: boolean, includeHazards: boolean, players: Player[]): IAresData {
    return {
      active: active,
      includeHazards: includeHazards,
      hazardData: {
        erosionOceanCount: {threshold: 3, available: true}, // oceans: add erosion tiles
        removeDustStormsOceanCount: {threshold: 6, available: true}, // oceans: remove dust storms
        severeErosionTemperature: {threshold: -4, available: true}, // temperatore: severe erosion
        severeDustStormOxygen: {threshold: 5, available: true}, // oxygen: severe dust storms
      },
      milestoneResults: players.map((p) => {
        return {id: p.id, count: 0};
      }),
    };
  }

  public static setupHazards(game: Game, playerCount: number) {
    // The number of dust storms depends on the player count.
    // I made up that the solo player has 3 dust storms. The rules
    // don't take solo into account, nor if you played with more than
    // five players.
    if (playerCount >= 5) {
      _AresHazardPlacement.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
    } else if (playerCount === 4) {
      _AresHazardPlacement.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
      _AresHazardPlacement.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, -1);
    } else if (playerCount <= 3) {
      _AresHazardPlacement.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
      _AresHazardPlacement.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 1);
      _AresHazardPlacement.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, -1);
    }
  }
}
