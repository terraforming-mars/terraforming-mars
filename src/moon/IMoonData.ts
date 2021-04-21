import {Player} from '../Player';
import {MoonBoard} from './MoonBoard';
import {SerializedMoonData} from './SerializedMoonData';

export interface IMoonData {
  moon: MoonBoard;
  colonyRate: number;
  miningRate: number;
  logisticRate: number;
  lunaFirstPlayer: Player | undefined;
  lunaProjectOfficeLastGeneration: number | undefined;
}

export namespace IMoonData {
  export function serialize(moonData: IMoonData | undefined): SerializedMoonData | undefined {
    if (moonData === undefined) {
      return undefined;
    }
    return {
      moon: moonData.moon.serialize(),
      colonyRate: moonData.colonyRate,
      miningRate: moonData.miningRate,
      logisticRate: moonData.logisticRate,
      lunaFirstPlayerId: moonData.lunaFirstPlayer ? moonData.lunaFirstPlayer.id : undefined,
      lunaProjectOfficeLastGeneration: moonData.lunaProjectOfficeLastGeneration,
    };
  };

  export function deserialize(moonData: SerializedMoonData, players: Array<Player>): IMoonData {
    const lunaFirstPlayer = players.find((p) => p.id === moonData.lunaFirstPlayerId);
    if (moonData.lunaFirstPlayerId !== undefined && lunaFirstPlayer === undefined) {
      throw new Error(`player ${moonData.lunaFirstPlayerId} not found`);
    }
    return {
      colonyRate: moonData.colonyRate,
      logisticRate: moonData.logisticRate,
      miningRate: moonData.miningRate,
      moon: MoonBoard.deserialize(moonData.moon, players),
      lunaFirstPlayer: lunaFirstPlayer,
      lunaProjectOfficeLastGeneration: moonData.lunaProjectOfficeLastGeneration,
    };
  }
}
