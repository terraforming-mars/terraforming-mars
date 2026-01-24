import {PlayerId} from '../../common/Types';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {MoonBoard} from './MoonBoard';
import {SerializedMoonData} from './SerializedMoonData';

export type MoonData = {
  moon: MoonBoard;
  habitatRate: number;
  miningRate: number;
  logisticRate: number;
  lunaFirstPlayer: IPlayer | undefined;
  lunaProjectOfficeLastGeneration: number | undefined;
}

export namespace MoonData {
  export function serialize(moonData: MoonData | undefined): SerializedMoonData | undefined {
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

  function findPlayer(players: Array<IPlayer>, playerId: PlayerId | undefined) {
    const player = players.find((player) => player.id === playerId);
    if (playerId !== undefined && player === undefined) {
      throw new Error(`player ${playerId} not found`);
    }
    return player;
  }

  export function deserialize(moonData: SerializedMoonData, players: Array<IPlayer>): MoonData {
    const spaces = Board.deserialize(moonData.moon, players).spaces;
    const board = new MoonBoard(spaces);

    return {
      habitatRate: moonData.habitatRate,
      logisticRate: moonData.logisticRate,
      miningRate: moonData.miningRate,
      moon: board,
      lunaFirstPlayer: findPlayer(players, moonData.lunaFirstPlayerId),
      lunaProjectOfficeLastGeneration: moonData.lunaProjectOfficeLastGeneration,
    };
  }
}
