import {Game} from '../src/server/Game';
import {IGame} from '../src/server/IGame';
import {GameOptions} from '../src/server/game/GameOptions';
import {TestPlayer} from './TestPlayer';
import {SelectInitialCards} from '../src/server/inputs/SelectInitialCards';

export type TestGameOptions = GameOptions & {
  /* skip initial card selection */
  skipInitialCardSelection: boolean;
};

function createPlayers(count: number, idSuffix: string): Array<TestPlayer> {
  return [
    TestPlayer.BLUE.newPlayer({name: 'player1', idSuffix}),
    TestPlayer.RED.newPlayer({name: 'player2', idSuffix}),
    TestPlayer.YELLOW.newPlayer({name: 'player3', idSuffix}),
    TestPlayer.GREEN.newPlayer({name: 'player4', idSuffix}),
    TestPlayer.BLACK.newPlayer({name: 'player5', idSuffix}),
    TestPlayer.PURPLE.newPlayer({name: 'player6', idSuffix}),
    TestPlayer.ORANGE.newPlayer({name: 'player7', idSuffix}),
    TestPlayer.PINK.newPlayer({name: 'player8', idSuffix}),
  ].slice(0, count);
}

/**
 * Creates a new game for testing. Has some hidden behavior for testing:
 *
 * 1. If aresExtension is true, and the player has not specifically enabled hazards, disable ares hazards.
 *    Hazard placement is non-deterministic.
 * 2. If skipInitialCardSelection is true, then the game ignores initial card selection. It's still
 *    in an intermediate state, but the game is testable.
 *
 * Players are returned in player order, so the first player returned is the first player.
 *
 * Test game has a return type with a spread array operator.
 */
// TODO(kberg): return IGame instead of Game
export function testGame(count: number, customOptions?: Partial<TestGameOptions>, idSuffix = ''): [Game, ...Array<TestPlayer>] {
  const players = createPlayers(count, idSuffix);

  const copy = {...customOptions};
  if (copy.aresExtension === true && copy.aresHazards === undefined) {
    copy.aresHazards = true;
  }

  const game = Game.newInstance(`game-id${idSuffix}`, players, players[0], customOptions);
  if (customOptions?.skipInitialCardSelection !== false) {
    for (const player of players) {
      /* Removes waitingFor if it is SelectInitialCards. Used when wanting it cleared out for further testing. */
      if (player.getWaitingFor() instanceof SelectInitialCards) {
        player.popWaitingFor();
      }
    }
  }
  return [game, ...players];
}

export function getTestPlayer(game: IGame, idx: number): TestPlayer {
  const players = game.getPlayers();
  const length = players.length;
  if (idx >= length) {
    throw new Error(`Invalid index ${idx} when game has ${length} players`);
  }
  return game.getPlayers()[idx] as TestPlayer;
}
