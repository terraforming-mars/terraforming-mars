import {Game} from '../Game';
import {IGame} from '../IGame';
import {GameId, isPlayerId} from '../../common/Types';
import {GameSetup} from '../GameSetup';
import {IPlayer} from '../IPlayer';
import {PlayerId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';
import {SerializedPlayer} from '../SerializedPlayer';
import {toID} from '../../common/utils/utils';

export class Cloner {
  public static clone(
    newGameId: GameId,
    players: Array<IPlayer>,
    firstPlayerIndex: number,
    serialized: SerializedGame): IGame {
    const serializedGameId: GameId = serialized.id;
    const serializedPlayerIds: Array<PlayerId> = serialized.players.map(toID);
    const playerIds: Array<PlayerId> = players.map(toID);
    if (serializedPlayerIds.length !== playerIds.length) {
      throw new Error(`Failing to clone from a ${serializedPlayerIds.length} game ${serializedGameId} to a ${playerIds.length} game.`);
    }
    Cloner.replacePlayerIds(serialized, serializedPlayerIds, playerIds);
    if (serializedPlayerIds.length === 1) {
      // The neutral player has a different ID in different games, and yet, it isn't serialized. So it gets a special case.
      Cloner.replacePlayerIds(
        serialized,
        [GameSetup.neutralPlayerFor(serializedGameId).id],
        [GameSetup.neutralPlayerFor(newGameId).id]);
    }
    serialized.id = newGameId;

    for (let idx = 0; idx < players.length; idx++) {
      this.updatePlayer(players[idx], serialized.players[idx]);
    }
    serialized.first = serialized.players[firstPlayerIndex].id;
    serialized.clonedGamedId = '#' + serializedGameId;
    serialized.createdTimeMs = new Date().getTime();
    const game = Game.deserialize(serialized);
    return game;
  }

  private static replacePlayerIds(obj: any, oldPlayerIds:Array<PlayerId>, newPlayerIds: Array<PlayerId>) {
    if (obj === undefined || obj === null) {
      return;
    }
    const keys = Object.entries(obj);
    keys.forEach(([key, val]) => {
      if (obj.hasOwnProperty(key)) {
        if (isPlayerId(val)) {
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

  private static updatePlayer(from: IPlayer, to: SerializedPlayer) {
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

