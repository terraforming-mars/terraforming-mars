import {GameId, isPlayerId} from '../../common/Types';
import {DELEGATES_PER_PLAYER} from '../../common/constants';
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {Player} from '../Player';
import {AutomaGameHooks} from './AutomaGameHooks';

/** Builds the automa (MarsBot) side of a new game. */
export class AutomaGameSetup {
  /** Returns MarsBot's player. Its id is derived from the game id, so a reload recreates it. */
  public static createMarsBotPlayer(gameId: GameId): IPlayer {
    const playerId = 'p-' + gameId + '-marsbot';
    if (!isPlayerId(playerId)) {
      throw new Error('Not a player id: ' + playerId);
    }
    return new Player('MarsBot', 'bronze', false, 0, playerId);
  }

  /** Creates MarsBot's player for `game` and gives it its delegates when Turmoil is on. */
  public static setup(game: IGame): AutomaGameHooks {
    const marsBotPlayer = AutomaGameSetup.createMarsBotPlayer(game.id);
    marsBotPlayer.setup(game);
    if (game.turmoil !== undefined) {
      game.turmoil.delegateReserve.add(marsBotPlayer, DELEGATES_PER_PLAYER);
    }
    return {marsBotPlayer};
  }
}
