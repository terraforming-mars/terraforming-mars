import {IPlayer} from '../IPlayer';

/**
 * The game's automa (MarsBot) machinery, present when the automa variant is on.
 * Grows as the automa port lands. For now it only names the MarsBot player,
 * which is deliberately not part of game.players.
 */
export interface IAutomaGameHooks {
  readonly marsBotPlayer: IPlayer;
}
