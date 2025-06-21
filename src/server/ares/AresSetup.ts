import {IPlayer} from '../IPlayer';
import {AresData} from '../../common/ares/AresData';
import {IGame} from '../IGame';
import {TileType} from '../../common/TileType';
import {AresHazards} from './AresHazards';

export class AresSetup {
  private constructor() {}

  public static initialData(includeHazards: boolean, players: IPlayer[]): AresData {
    return {
      includeHazards: includeHazards,
      hazardData: {
        erosionOceanCount: {threshold: 3, available: true}, // oceans: add erosion tiles
        removeDustStormsOceanCount: {threshold: 6, available: true}, // oceans: remove dust storms
        severeErosionTemperature: {threshold: -4, available: true}, // temperatore: severe erosion
        severeDustStormOxygen: {threshold: 5, available: true}, // oxygen: severe dust storms
      },
      milestoneResults: players.map((p) => {
        return {id: p.id, networkerCount: 0, purifierCount: 0};
      }),
    };
  }

  public static setupHazards(game: IGame, playerCount: number) {
    // The number of dust storms depends on the player count.
    // I made up that the solo player has 3 dust storms. The rules
    // don't take solo into account, nor if you played with more than
    // five players.
    if (playerCount >= 5) {
      AresHazards.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 'top', 2);
    } else if (playerCount === 4) {
      AresHazards.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 'top');
      AresHazards.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 'bottom');
    } else if (playerCount <= 3) {
      AresHazards.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 'top', 2);
      AresHazards.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 'top');
      AresHazards.randomlyPlaceHazard(game, TileType.DUST_STORM_MILD, 'bottom');
    }
  }
}
