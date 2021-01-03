import {Game, GameId} from '../Game';
import {GameSetup} from '../GameSetup';
import {Player} from '../Player';
import {SerializedGame} from '../SerializedGame';
import {SerializedPlayer} from '../SerializedPlayer';
import {DbLoadCallback} from './IDatabase';

export class Cloner {
  public static clone(
    newGameId: GameId,
    players: Array<Player>,
    firstPlayerIndex: number,
    err: any,
    serialized: SerializedGame | undefined,
    cb: DbLoadCallback<Game>) {
    if (err !== undefined) {
      cb(err, undefined);
      return;
    }
    if (serialized === undefined) {
      cb(err, undefined);
      return;
    }

    const sourceGameId = serialized.id;
    const oldPlayerIds = serialized.players.map((player) => player.id);
    const newPlayerIds = players.map((player) => player.id);
    if (oldPlayerIds.length !== newPlayerIds.length) {
      throw new Error(`Failing to clone from a ${oldPlayerIds.length} game ${sourceGameId} to a ${newPlayerIds.length} game.`);
    }
    Cloner.replacePlayerIds(serialized, oldPlayerIds, newPlayerIds);
    if (oldPlayerIds.length === 1) {
      Cloner.replacePlayerIds(
        serialized,
        [GameSetup.neutralPlayerFor(sourceGameId).id],
        [GameSetup.neutralPlayerFor(newGameId).id]);
    }
    serialized.id = newGameId;

    for (let idx = 0; idx < players.length; idx++) {
      this.updatePlayer(players[idx], serialized.players[idx]);
    }
    serialized.first = serialized.players[firstPlayerIndex].id;
    serialized.clonedGamedId = '#' + sourceGameId;

    const game: Game = Game.deserialize(serialized);

    cb(undefined, game);
  }

  private static replacePlayerIds(obj: any, oldPlayerIds:Array<string>, newPlayerIds: Array<string>) {
    if (obj === undefined || obj === null || typeof obj !== 'object') {
      return;
    }
    const keys = Object.entries(obj);
    keys.forEach(([key, val]) => {
      if (obj.hasOwnProperty(key)) {
        if (typeof val === 'string') {
          const idx = oldPlayerIds.indexOf(val);
          if (idx > -1) {
            obj[key] = newPlayerIds[idx];
          }
        } else if (typeof val === 'object') {
          Cloner.replacePlayerIds(val, oldPlayerIds, newPlayerIds);
        }
      }
    });
  }

  private static updatePlayer(from: Player, to: SerializedPlayer) {
    // id is already copied over.
    to.color = from.color;
    to.name = from.name;

    // Handicap updates are only done during game set-up. So when cloning, adjust the
    // terraforming rating to the difference between the two handicaps.
    const terraformRatingDelta = from.handicap - to.handicap;
    const newTerraformRating = to.terraformRating + terraformRatingDelta;
    to.terraformRating = newTerraformRating;
    // Also update the handicap to reflect appropriately.
    to.handicap = from.handicap;
  }
}

