import {expect} from 'chai';
import {Game} from '../../src/Game';
import {GameLoader} from '../../src/database/GameLoader';
import {Player} from '../../src/Player';
import {SerializedGame} from '../../src/SerializedGame';

import {TestPlayers} from '../TestPlayers';
import {Color} from '../../src/common/Color';
import {GameIdLedger} from '../../src/database/IDatabase';
import {GameId, PlayerId} from '../../src/common/Types';
import {restoreTestDatabase, setTestDatabase} from '../utils/setup';
import {sleep} from '../TestingUtils';
import {InMemoryDatabase} from '../testing/InMemoryDatabase';

class TestDatabase extends InMemoryDatabase {
  public failure: 'getGameIds' | 'getParticipants' | undefined = undefined;
  public getGameSleep: number = 0;

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

  beforeEach(function() {
    database = new TestDatabase();
    setTestDatabase(database);
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    instance = (GameLoader.getInstance() as GameLoader);
    instance.reset();
  });
  afterEach(function() {
    restoreTestDatabase();
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
    instance.reset();
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
    const numberOfGames : number = 10;
    for (let i = 0; i < numberOfGames; i++) {
      const player = new Player('name', Color.BLUE, false, 0, 'p-' + i as PlayerId);
      Game.newInstance('game-' + i as GameId, [player], player);
    }
    database.getGameSleep = 500;
    instance.reset();
    const list = await instance.getIds();
    expect(list?.map((e) => e.gameId)).to.have.members([
      'game-0', 'game-1', 'game-2', 'game-3', 'game-4',
      'game-5', 'game-6', 'game-7', 'game-8', 'game-9',
    ]);
  });
});
