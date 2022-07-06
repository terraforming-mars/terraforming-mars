import {expect} from 'chai';
import {Game, GameOptions, Score} from '../../src/Game';
import {GameLoader} from '../../src/database/GameLoader';
import {Player} from '../../src/Player';
import {SerializedGame} from '../../src/SerializedGame';
import {TestPlayers} from '../TestPlayers';
import {Color} from '../../src/common/Color';
import {IDatabase} from '../../src/database/IDatabase';
import {GameId, PlayerId, SpectatorId} from '../../src/common/Types';
import {restoreTestDatabase, setTestDatabase} from '../utils/setup';
import {sleep} from '../TestingUtils';

class InMemoryDatabase implements IDatabase {
  public data: Map<GameId, Array<SerializedGame>> = new Map();

  public failure: 'getGames' | undefined = undefined;
  public getGameSleep: number = 0;

  initialize(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async getGame(gameId: GameId): Promise<SerializedGame> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      throw new Error('not found');
    } else {
      const game = row[row.length -1];
      await sleep(this.getGameSleep);
      return game;
    }
  }
  getGameId(_id: PlayerId | SpectatorId): Promise<GameId> {
    throw new Error('Method not implemented.');
  }
  getSaveIds(gameId: GameId): Promise<number[]> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      return Promise.reject(new Error('not found'));
    } else {
      return Promise.resolve([...Array(row?.length).keys()]);
    }
  }
  getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      return Promise.reject(new Error('not found'));
    }
    const serializedGame = row[saveId];
    if (serializedGame === undefined) {
      return Promise.reject(new Error('not found'));
    }
    return Promise.resolve(serializedGame);
  }
  getGames(): Promise<GameId[]> {
    if (this.failure === 'getGames') return Promise.reject(new Error('error'));
    return Promise.resolve(Array.from(this.data.keys()));
  }
  getPlayerCount(_game_id: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  saveGame(game: Game): Promise<void> {
    const gameId = game.id;
    const row = this.data.get(gameId) || [];
    this.data.set(gameId, row);
    while (row.length < game.lastSaveId) {
      row.push();
    }
    row[game.lastSaveId + 1] = game.serialize();
    game.lastSaveId++;
    return Promise.resolve();
  }
  saveGameResults(_game_id: string, _players: number, _generations: number, _gameOptions: GameOptions, _scores: Score[]): void {
    throw new Error('Method not implemented.');
  }
  restoreGame(_game_id: string, _save_id: number): Promise<SerializedGame> {
    throw new Error('Method not implemented.');
  }
  loadCloneableGame(_game_id: string): Promise<SerializedGame> {
    throw new Error('Method not implemented.');
  }
  deleteGameNbrSaves(_game_id: string, _rollbackCount: number): void {
    throw new Error('Method not implemented.');
  }
  cleanGame(_game_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  purgeUnfinishedGames(): void {
    throw new Error('Method not implemented.');
  }
  stats(): Promise<{[ key: string ]: string | number;}> {
    throw new Error('Method not implemented.');
  }
}

describe('GameLoader', function() {
  let instance: GameLoader;
  let database: InMemoryDatabase;
  let game: Game;

  beforeEach(function() {
    database = new InMemoryDatabase();
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
    const game = await instance.getByParticipantId('player-doesnotexist');
    expect(game).is.undefined;
  });

  it('gets game when it exists in database', async function() {
    const game1 = await instance.getByGameId('gameid', false);
    expect(game1!.id).to.eq(game.id);
  });

  it('gets no game when fails to deserialize from database', async function() {
    const originalDeserialize = Game.deserialize;
    Game.deserialize = function() {
      throw new Error('could not parse this');
    };
    try {
      const game1 = await instance.getByGameId('gameid', false);
      expect(game1).is.undefined;
    } finally {
      Game.deserialize = originalDeserialize;
    }
  });

  it('gets game when requested before database loaded', async function() {
    const game1 = instance.getByGameId('gameid', false);
    expect(game1).is.not.undefined;
  });

  it('gets player when requested before database loaded', async function() {
    const game1 = await instance.getByParticipantId(game.getPlayersInGenerationOrder()[0].id);
    expect(game1).is.not.undefined;
  });

  it('gets no game when game goes missing from database', async function() {
    const game1 = await instance.getByGameId('game-never', false);
    expect(game1).is.undefined;
    database.data.delete('gameid');
    const game2 = await instance.getByGameId('gameid', false);
    expect(game2).is.undefined;
  });

  it('gets player when it exists in database', async function() {
    const players = game.getPlayersInGenerationOrder();
    const game1 = await instance.getByParticipantId(players[Math.floor(Math.random() * players.length)].id);
    expect(game1!.id).to.eq(game.id);
  });

  it('gets game when added and not in database', async function() {
    game.id = 'gameid-alpha';
    try {
      instance.add(game);
      const game1 = await instance.getByGameId('gameid-alpha', false);
      expect(game1!.id).to.eq('gameid-alpha');
    } finally {
      game.id = 'gameid';
    }
  });

  it('gets player when added and not in database', async function() {
    const players = game.getPlayersInGenerationOrder();
    instance.add(game);
    const game1 = await instance.getByParticipantId(players[Math.floor(Math.random() * players.length)]!.id);
    expect(game1).is.not.undefined;
    const list = await instance.getLoadedGameIds();
    expect(list).to.deep.eq(
      [{'id': 'gameid', 'participants': ['p-blue-id', 'p-red-id']}],
    );
  });

  it('loads values after error pulling game ids', async function() {
    database.failure = 'getGames';
    instance.reset();
    const game1 = await instance.getByGameId('gameid', false);
    expect(game1).is.undefined;
  });

  it('loads values when no game ids', async function() {
    database.data.delete('gameid');
    const game1 = await instance.getByGameId('gameid', false);
    expect(game1).is.undefined;
  });

  it('loads players that will never exist', async function() {
    const game1 = await instance.getByParticipantId('p-non-existent-id');
    expect(game1).is.undefined;
  });

  it('loads players available later', async function() {
    const game1 = await instance.getByGameId('gameid', false);
    expect(game1!.id).to.eq('gameid');
    const game2 = await GameLoader.getInstance().getByParticipantId(game.getPlayersInGenerationOrder()[0].id);
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
    const list = await instance.getLoadedGameIds();
    expect(list?.map((e) => e.id)).to.have.members([
      'game-0', 'game-1', 'game-2', 'game-3', 'game-4',
      'game-5', 'game-6', 'game-7', 'game-8', 'game-9',
    ]);
  });
});
