import {Game} from '../src/server/Game';
import {GameOptions} from '../src/server/GameOptions';
import {setCustomGameOptions} from './TestingUtils';
import {TestPlayer} from './TestPlayer';

export type TestGame = Game & {testPlayers: Array<TestPlayer>};

export function newTestGame(count: number, customOptions?: Partial<GameOptions>, idSuffix = ''): TestGame {
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
    setCustomGameOptions(customOptions);
  const game = Game.newInstance(`game-id${idSuffix}`, players, players[0], options);

  // I'm not proud of these next two steps.
  (game as any).testPlayers = players;
  return game as TestGame;
}
