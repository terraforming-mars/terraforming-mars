import {GameId, PlayerId} from '@/common/Types';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {IGame} from '@/server/IGame';
import {IPlayer} from '@/server/IPlayer';
import {Player} from '@/server/Player';

export class AutomaGameSetup {
  /**
   * Creates MarsBot's player.
   *
   * Its id comes from the game id, so loading a saved game recreates the same player.
   */
  public static createMarsBotPlayer(gameId: GameId): IPlayer {
    const playerId: PlayerId = `p-${gameId}-marsbot`;
    return new Player('MarsBot', 'bronze', false, 0, playerId);
  }

  /** Adds MarsBot's player to a new automa game, with its delegates when Turmoil is on. */
  public static setup(game: IGame): void {
    const marsBotPlayer = AutomaGameSetup.createMarsBotPlayer(game.id);
    marsBotPlayer.setup(game);
    game.marsBotPlayer = marsBotPlayer;
    game.turmoil?.delegateReserve.add(marsBotPlayer, DELEGATES_PER_PLAYER);
  }
}
