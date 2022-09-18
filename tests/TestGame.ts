import {Game} from '../src/server/Game';
import {GameOptions} from '../src/server/GameOptions';
import {testGameOptions} from './TestingUtils';
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
    testGameOptions(customOptions);
  return Game.newInstance(`game-id${idSuffix}`, players, players[0], options);
}

export function getTestPlayer(game: Game, idx: number): TestPlayer {
  const players = game.getPlayers();
  const length = players.length;
  if (idx >= length) {
    throw new Error(`Invalid index ${idx} when game has ${length} players`);
  }
  return game.getPlayers()[idx] as TestPlayer;
}

export function getTestPlayers(game: Game): Array<TestPlayer> {
  return game.getPlayers() as Array<TestPlayer>;
}
