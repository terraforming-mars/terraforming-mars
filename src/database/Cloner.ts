import {Game, GameId} from '../Game';
import {Player} from '../Player';
import {Database} from './Database';
import {DbLoadCallback} from './IDatabase';

export class Cloner {
  public static clone(id: GameId,
    sourceGameId: GameId,
    players: Array<Player>,
    firstPlayerIndex: number,
    cb: DbLoadCallback<Game>): void {
    Database.getInstance().loadCloneableGame(sourceGameId, (err, serialized) => {
      if (err !== undefined) {
        cb(err, undefined);
        return;
      }
      if (serialized === undefined) {
        cb(err, undefined);
        return;
      }

      const playerIds = players.map((player) => player.id);
      Cloner.replacePlayers(serialized, playerIds);
      serialized.id = id;
      serialized.players = players.map((player) => player.serialize());
      serialized.first = serialized.players[firstPlayerIndex];

      const game: Game = Game.deserialize(serialized);
      cb(undefined, game);
    });
  }

  private static replacePlayers(obj: any, ids: Array<string>) {
    if (obj === undefined || obj === null || typeof obj !== 'object') {
      return;
    }
    const keys = Object.entries(obj);
    keys.forEach(([key, val]) => {
      if (obj.hasOwnProperty(key)) {
        if (typeof val === 'string') {
          const idx = ids.indexOf(val);
          if (idx > -1) {
            obj[key] = ids[idx];
          }
        } else if (typeof val === 'object') {
          Cloner.replacePlayers(val, ids);
        }
      }
    });
  }
}

