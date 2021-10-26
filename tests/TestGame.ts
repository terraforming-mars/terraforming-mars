import {Game, GameOptions} from '../src/Game';
import {TestPlayers} from './TestPlayers';
import {TestingUtils} from './TestingUtils';
import {TestPlayer} from './TestPlayer';

export function newTestGame(count: number, customOptions?: Partial<GameOptions>): Game {
  const players = [
    TestPlayers.BLUE.newPlayer(),
    TestPlayers.RED.newPlayer(),
    TestPlayers.YELLOW.newPlayer(),
    TestPlayers.GREEN.newPlayer(),
    TestPlayers.BLACK.newPlayer(),
    TestPlayers.PURPLE.newPlayer(),
    TestPlayers.ORANGE.newPlayer(),
    TestPlayers.PINK.newPlayer(),
  ].slice(0, count);

  const options: GameOptions | undefined = customOptions === undefined ?
    undefined :
    TestingUtils.setCustomGameOptions(customOptions);
  return Game.newInstance('game-id', players, players[0], options);
}

export function getTestPlayer(game: Game, idx: number): TestPlayer {
  return ((game as any).players[idx]) as TestPlayer;
}
