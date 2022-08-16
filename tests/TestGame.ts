import {Game} from '../src/server/Game';
import {GameOptions} from '../src/server/GameOptions';
import {setCustomGameOptions} from './TestingUtils';
import {TestPlayer} from './TestPlayer';

export function newTestGame(count: number, customOptions?: Partial<GameOptions>, idSuffix = ''): Game {
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
  return Game.newInstance(`game-id${idSuffix}`, players, players[0], options);
}

export function getTestPlayer(game: Game, idx: number): TestPlayer {
  return ((game as any).players[idx]) as TestPlayer;
}
