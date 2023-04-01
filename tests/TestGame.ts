import {Game} from '../src/server/Game';
import {GameOptions} from '../src/server/GameOptions';
import {testGameOptions} from './TestingUtils';
import {TestPlayer} from './TestPlayer';
import {SelectInitialCards} from '../src/server/inputs/SelectInitialCards';

type _TestOptions = {
  /* skip initial card selection */
  skipInitialCardSelection: boolean;
}
export type TestGameOptions = GameOptions & _TestOptions;

export function testGame(count: number, customOptions?: Partial<TestGameOptions>, idSuffix = ''): [Game, ...Array<TestPlayer>] {
  const players = [
    TestPlayer.BLUE.newPlayer(false, idSuffix),
    TestPlayer.RED.newPlayer(false, idSuffix),
    TestPlayer.YELLOW.newPlayer(false, idSuffix),
    TestPlayer.GREEN.newPlayer(false, idSuffix),
    TestPlayer.BLACK.newPlayer(false, idSuffix),
    TestPlayer.PURPLE.newPlayer(false, idSuffix),
    TestPlayer.ORANGE.newPlayer(false, idSuffix),
    TestPlayer.PINK.newPlayer(false, idSuffix),
  ].slice(0, count);

  const options: GameOptions | undefined = customOptions === undefined ?
    undefined :
    testGameOptions(customOptions);
  const game = Game.newInstance(`game-id${idSuffix}`, players, players[0], options);
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

export function getTestPlayer(game: Game, idx: number): TestPlayer {
  const players = game.getPlayers();
  const length = players.length;
  if (idx >= length) {
    throw new Error(`Invalid index ${idx} when game has ${length} players`);
  }
  return game.getPlayers()[idx] as TestPlayer;
}
