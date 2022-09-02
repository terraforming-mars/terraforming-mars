import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {GameLoader} from '../../src/server/database/GameLoader';
import {Player} from '../../src/server/Player';
import {SerializedGame} from '../../src/server/SerializedGame';

import {TestPlayer} from '../TestPlayer';
import {Color} from '../../src/common/Color';
import {GameIdLedger} from '../../src/server/database/IDatabase';
import {GameId, PlayerId} from '../../src/common/Types';
import {restoreTestDatabase, restoreTestGameLoader, setTestDatabase, setTestGameLoader} from '../utils/setup';
import {sleep} from '../TestingUtils';
import {InMemoryDatabase} from '../testing/InMemoryDatabase';
import {FakeClock} from '../common/FakeClock';

class TestDatabase extends InMemoryDatabase {
  public failure: 'getGameIds' | 'getParticipants' | undefined = undefined;
  public getGameSleep = 0;

  override async getGame(gameId: GameId): Promise<SerializedGame> {
    const game = await super.getGame(gameId);
    await sleep(this.getGameSleep);
    return game;
  }

  override getGameIds(): Promise<GameId[]> {
    if (this.failure === 'getGameIds') return Promise.reject(new Error('error'));
    return super.getGameIds();
  }
  override getParticipants(): Promise<Array<GameIdLedger>> {
    if (this.failure === 'getParticipants') return Promise.reject(new Error('error'));
    return super.getParticipants();
  }
}

describe('GameLoader', function() {
  let instance: GameLoader;
  let database: TestDatabase;
  let game: Game;
  let clock: FakeClock;

  beforeEach(function() {
    clock = new FakeClock();
    instance = GameLoader.newTestInstance({sleepMillis: 0, evictMillis: 100, sweep: 'manual'}, clock);
    setTestGameLoader(instance);
    database = new TestDatabase();
    setTestDatabase(database);
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    instance.resetForTesting();
  });
  afterEach(function() {
    restoreTestDatabase();
    restoreTestGameLoader();
  });

  it('uses shared instance', function() {
    expect(instance).to.eq(GameLoader.getInstance());
  });

  it('gets undefined when player does not exist', async function() {
    const game = await instance.getGame('player-doesnotexist');
    expect(game).is.undefined;
  });

  it('gets game when it exists in database', async function() {
    const game1 = await instance.getGame('gameid');
    expect(game1!.id).to.eq(game.id);
  });

  it('gets no game when fails to deserialize from database', async function() {
    const originalDeserialize = Game.deserialize;
    Game.deserialize = function() {
      throw new Error('could not parse this');
    };
    try {
      const game1 = await instance.getGame('gameid');
      expect(game1).is.undefined;
    } finally {
      Game.deserialize = originalDeserialize;
    }
  });

  it('gets game when requested before database loaded', async function() {
    const game1 = instance.getGame('gameid');
    expect(game1).is.not.undefined;
  });

  it('gets player when requested before database loaded', async function() {
    const game1 = await instance.getGame(game.getPlayersInGenerationOrder()[0].id);
    expect(game1).is.not.undefined;
  });

  it('gets no game when game goes missing from database', async function() {
    const game1 = await instance.getGame('game-never');
    expect(game1).is.undefined;
    database.data.delete('gameid');
    const game2 = await instance.getGame('gameid');
    expect(game2).is.undefined;
  });

  it('gets player when it exists in database', async function() {
    const players = game.getPlayersInGenerationOrder();
    const game1 = await instance.getGame(players[Math.floor(Math.random() * players.length)].id);
    expect(game1!.id).to.eq(game.id);
  });

  it('gets game when added and not in database', async function() {
    game.id = 'gameid-alpha';
    try {
      instance.add(game);
      const game1 = await instance.getGame('gameid-alpha');
      expect(game1!.id).to.eq('gameid-alpha');
    } finally {
      game.id = 'gameid';
    }
  });

  it('gets player when added and not in database', async function() {
    const players = game.getPlayersInGenerationOrder();
    instance.add(game);
    const game1 = await instance.getGame(players[Math.floor(Math.random() * players.length)]!.id);
    expect(game1).is.not.undefined;
    const list = await instance.getIds();
    expect(list).to.deep.eq(
      [{'gameId': 'gameid', 'participantIds': ['p-blue-id', 'p-red-id']}],
    );
  });

  it('loads values after error pulling game ids', async function() {
    database.failure = 'getParticipants';
    instance.resetForTesting();
    const game1 = await instance.getGame('gameid');
    expect(game1).is.undefined;
  });

  it('loads values when no game ids', async function() {
    database.data.delete('gameid');
    const game1 = await instance.getGame('gameid');
    expect(game1).is.undefined;
  });

  it('loads players that will never exist', async function() {
    const game1 = await instance.getGame('p-non-existent-id');
    expect(game1).is.undefined;
  });

  it('loads players available later', async function() {
    const game1 = await instance.getGame('gameid');
    expect(game1!.id).to.eq('gameid');
    const game2 = await GameLoader.getInstance().getGame(game.getPlayersInGenerationOrder()[0].id);
    expect(game2!.id).to.eq('gameid');
  });

  it('waits for games to finish loading', async function() {
    // Set up a clean number of games;
    database.data.delete('gameid');
    const numberOfGames = 10;
    for (let i = 0; i < numberOfGames; i++) {
      const player = new Player('name', Color.BLUE, false, 0, 'p-' + i as PlayerId);
      Game.newInstance('game-' + i as GameId, [player], player);
    }
    database.getGameSleep = 500;
    instance.resetForTesting();
    const list = await instance.getIds();
    expect(list?.map((e) => e.gameId)).to.have.members([
      'game-0', 'game-1', 'game-2', 'game-3', 'game-4',
      'game-5', 'game-6', 'game-7', 'game-8', 'game-9',
    ]);
  });

  it('evicts finished game', async () => {
    const ids = await instance.getIds();
    expect(ids).deep.eq(
      [{
        'gameId': 'gameid',
        'participantIds': [
          'p-blue-id',
          'p-red-id',
        ],
      }],
    );
    instance.resetForTesting();
    expect(await instance.isCached('gameid')).is.false;
    await instance.getGame('gameid');
    expect(await instance.isCached('gameid')).is.true;

    // In beforeEach, eviction time is 100ms.

    clock.millis = 5;
    instance.mark('gameid');
    instance.sweep();
    expect(await instance.isCached('gameid')).is.true;

    clock.millis = 104;
    instance.sweep();
    expect(await instance.isCached('gameid')).is.true;

    clock.millis = 105;
    instance.sweep();
    expect(await instance.isCached('gameid')).is.false;
  });
});
