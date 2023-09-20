import {IPlayer} from '../IPlayer';
import {MoonBoard} from './MoonBoard';
import {SerializedMoonData} from './SerializedMoonData';

export interface IMoonData {
  moon: MoonBoard;
  habitatRate: number;
  miningRate: number;
  logisticRate: number;
  lunaFirstPlayer: IPlayer | undefined;
  lunaProjectOfficeLastGeneration: number | undefined;
}

export namespace IMoonData {
  export function serialize(moonData: IMoonData | undefined): SerializedMoonData | undefined {
    if (moonData === undefined) {
      return undefined;
    }
    return {
      moon: moonData.moon.serialize(),
      habitatRate: moonData.habitatRate,
      miningRate: moonData.miningRate,
      logisticRate: moonData.logisticRate,
      lunaFirstPlayerId: moonData.lunaFirstPlayer ? moonData.lunaFirstPlayer.id : undefined,
      lunaProjectOfficeLastGeneration: moonData.lunaProjectOfficeLastGeneration,
    };
  }

  export function deserialize(moonData: SerializedMoonData, players: Array<IPlayer>): IMoonData {
    const lunaFirstPlayer = players.find((p) => p.id === moonData.lunaFirstPlayerId);
    if (moonData.lunaFirstPlayerId !== undefined && lunaFirstPlayer === undefined) {
      throw new Error(`player ${moonData.lunaFirstPlayerId} not found`);
    }
    return {
      habitatRate: moonData.habitatRate,
      logisticRate: moonData.logisticRate,
      miningRate: moonData.miningRate,
      moon: MoonBoard.deserialize(moonData.moon, players),
      lunaFirstPlayer: lunaFirstPlayer,
      lunaProjectOfficeLastGeneration: moonData.lunaProjectOfficeLastGeneration,
    };
  }
}
