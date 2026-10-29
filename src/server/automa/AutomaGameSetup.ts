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

  /** Gives MarsBot its delegates in a new automa game when Turmoil is on. */
  public static setup(game: IGame, marsBotPlayer: IPlayer): void {
    game.turmoil?.delegateReserve.add(marsBotPlayer, DELEGATES_PER_PLAYER);
  }
}
