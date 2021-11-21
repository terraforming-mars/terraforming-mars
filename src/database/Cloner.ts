import {Game, GameId} from '../Game';
import {GameSetup} from '../GameSetup';
import {Player, PlayerId} from '../Player';
import {SerializedGame} from '../SerializedGame';
import {SerializedPlayer} from '../SerializedPlayer';
import {DbLoadCallback} from './IDatabase';

export class Cloner {
  public static clone(
    newGameId: GameId,
    players: Array<Player>,
    firstPlayerIndex: number,
    err: Error | undefined,
    serialized: SerializedGame | undefined,
    cb: DbLoadCallback<Game>) {
    const response: {err?: Error, game: Game | undefined} = {err: err, game: undefined};

    try {
      if ((err === undefined || err === null) && serialized !== undefined) {
        const sourceGameId: GameId = serialized.id;
        const oldPlayerIds: Array<PlayerId> = serialized.players.map((player) => player.id);
        const newPlayerIds: Array<PlayerId> = players.map((player) => player.id);
        if (oldPlayerIds.length !== newPlayerIds.length) {
          throw new Error(`Failing to clone from a ${oldPlayerIds.length} game ${sourceGameId} to a ${newPlayerIds.length} game.`);
        }
        Cloner.replacePlayerIds(serialized, oldPlayerIds, newPlayerIds);
        if (oldPlayerIds.length === 1) {
          // The neutral player has a different ID in different games, and yet, it isn't serialized. So it gets a special case.
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

        response.game = Game.deserialize(serialized);
      }
    } catch (e) {
      response.err = e instanceof Error ? e : new Error(String(e));
    }
    cb(response.err, response.game);
  }

  private static replacePlayerIds(obj: any, oldPlayerIds:Array<PlayerId>, newPlayerIds: Array<PlayerId>) {
    if (obj === undefined || obj === null) {
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
    const terraformRatingDelta = Number(from.handicap) - Number(to.handicap);
    const newTerraformRating = Number(to.terraformRating) + terraformRatingDelta;
    to.terraformRating = newTerraformRating;
    // Also update the handicap to reflect appropriately.
    to.handicap = Number(from.handicap);
  }
}

