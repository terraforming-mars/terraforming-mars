import {Game, GameOptions} from '../src/Game';
import {TestPlayers} from './TestPlayers';
import {setCustomGameOptions} from './TestingUtils';
import {TestPlayer} from './TestPlayer';

export function newTestGame(count: number, customOptions?: Partial<GameOptions>, idSuffix = ''): Game {
  const players = [
    TestPlayers.BLUE.newPlayer(false, idSuffix),
    TestPlayers.RED.newPlayer(false, idSuffix),
    TestPlayers.YELLOW.newPlayer(false, idSuffix),
    TestPlayers.GREEN.newPlayer(false, idSuffix),
    TestPlayers.BLACK.newPlayer(false, idSuffix),
    TestPlayers.PURPLE.newPlayer(false, idSuffix),
    TestPlayers.ORANGE.newPlayer(false, idSuffix),
    TestPlayers.PINK.newPlayer(false, idSuffix),
  ].slice(0, count);

  const options: GameOptions | undefined = customOptions === undefined ?
    undefined :
    setCustomGameOptions(customOptions);
  return Game.newInstance(`game-id${idSuffix}`, players, players[0], options);
}

export function getTestPlayer(game: Game, idx: number): TestPlayer {
  return ((game as any).players[idx]) as TestPlayer;
}
