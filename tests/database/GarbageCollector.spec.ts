import {expect} from 'chai';
import {Game} from '../../src/Game';
import {GameLoader} from '../../src/database/GameLoader';
import {GarbageCollector} from '../../src/database/GarbageCollector';
import {Phase} from '../../src/Phase';
import {TestPlayers} from '../TestPlayers';

class TestGarbageCollector extends GarbageCollector {
  public run(): void {
    super.run();
  }
}

describe('GameLoader', function() {
  const getLoadedGames = GameLoader.getInstance().getLoadedGames;
  const remove = GameLoader.getInstance().remove;
  const player = TestPlayers.BLUE.newPlayer();
  after(function() {
    GameLoader.getInstance().getLoadedGames = getLoadedGames;
    GameLoader.getInstance().remove = remove;
  });
  it('removes games with END phase', function() {
    const expectedGames = new Map<string, Game | undefined>();
    const game1 = Game.newInstance('foo', [player], player);
    const game2 = Game.newInstance('bar', [player], player);
    expectedGames.set('foo', game1);
    expectedGames.set('bar', game2);
    game1.phase = Phase.END;
    const removedIds: Array<string> = [];
    GameLoader.getInstance().getLoadedGames = () => {
      return expectedGames;
    };
    GameLoader.getInstance().remove = (gameId) => {
      removedIds.push(gameId);
    };
    const collector = new TestGarbageCollector(GameLoader.getInstance());
    collector.run();
    expect(removedIds.length).eq(1);
    expect(removedIds[0]).eq('foo');
  });
});
