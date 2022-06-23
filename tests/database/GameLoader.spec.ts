import {expect} from 'chai';
import {Game, GameOptions, Score} from '../../src/Game';
import {GameLoader} from '../../src/database/GameLoader';
import {Player} from '../../src/Player';
import {SerializedGame} from '../../src/SerializedGame';
import {TestPlayers} from '../TestPlayers';
import {Color} from '../../src/common/Color';
import {IDatabase} from '../../src/database/IDatabase';
import {GameId} from '../../src/common/Types';
import {restoreTestDatabase, setTestDatabase} from '../utils/setup';

class InMemoryDatabase implements IDatabase {
  public data: Map<GameId, Array<SerializedGame | undefined>> = new Map();

  public failure: 'getGames' | undefined = undefined;
  public getGameSleep: number = 0;

  initialize(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  getGame(gameId: string, cb: (err: Error | undefined, game?: SerializedGame | undefined) => void): void {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      cb(new Error('not found'), undefined);
    } else {
      const game = row[row.length -1];
      if (this.getGameSleep === 0) {
        cb(undefined, game);
      } else {
        setTimeout(() => cb(undefined, game), this.getGameSleep);
      }
    }
  }
  getGameId(_id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getSaveIds(gameId: string): Promise<number[]> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      return Promise.reject(new Error('not found'));
    } else {
      return Promise.resolve([...Array(row?.length).keys()]);
    }
  }
  getGameVersion(gameId: string, saveId: number): Promise<SerializedGame> {
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
  getGames(): Promise<string[]> {
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
  cleanSaves(_game_id: string): Promise<void> {
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
  let foobarGame: Game;

  beforeEach(function() {
    database = new InMemoryDatabase();
    setTestDatabase(database);
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    foobarGame = Game.newInstance('foobar', [player, player2], player);
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
    const game = await instance.getByParticipantId('foobar');
    expect(game).is.undefined;
  });

  it('gets game when it exists in database', function(done) {
    instance.getByGameId('foobar', false, (game1) => {
      try {
        expect(game1!.id).to.eq(foobarGame.id);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('gets no game when fails to deserialize from database', function(done) {
    const originalDeserialize = Game.deserialize;
    Game.deserialize = function() {
      throw new Error('could not parse this');
    };
    instance.getByGameId('foobar', false, (game1) => {
      try {
        expect(game1).is.undefined;
        done();
      } catch (error) {
        done(error);
      } finally {
        Game.deserialize = originalDeserialize;
      }
    });
  });

  it('gets game when requested before database loaded', function(done) {
    instance.getByGameId('foobar', false, (game1) => {
      try {
        expect(game1).is.not.undefined;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('gets player when requested before database loaded', async function() {
    const game1 = await instance.getByParticipantId(foobarGame.getPlayersInGenerationOrder()[0].id);
    expect(game1).is.not.undefined;
  });

  it('gets no game when game goes missing from database', function(done) {
    instance.getByGameId('never', false, (game1) => {
      try {
        expect(game1).is.undefined;
        database.data.delete('foobar');
        instance.getByGameId('foobar', false, (game1) => {
          try {
            expect(game1).is.undefined;
            done();
          } catch (error) {
            done(error);
          }
        });
      } catch (error) {
        done(error);
      }
    });
  });

  it('gets player when it exists in database', async function() {
    const players = foobarGame.getPlayersInGenerationOrder();
    const game1 = await instance.getByParticipantId(players[Math.floor(Math.random() * players.length)].id);
    expect(game1!.id).to.eq(foobarGame.id);
  });

  it('gets game when added and not in database', function(done) {
    foobarGame.id = 'alpha';
    instance.add(foobarGame);
    instance.getByGameId('alpha', false, (game1) => {
      try {
        expect(game1!.id).to.eq('alpha');
        done();
      } catch (error) {
        done(error);
      } finally {
        foobarGame.id = 'foobar';
      }
    });
  });

  it('gets player when added and not in database', function(done) {
    const players = foobarGame.getPlayersInGenerationOrder();
    instance.add(foobarGame);
    instance.getByParticipantId(players[Math.floor(Math.random() * players.length)]!.id).then((game1) => {
      expect(game1).is.not.undefined;
      instance.getLoadedGameIds((list) => {
        try {
          expect(list).to.deep.eq(
            [{'id': 'foobar', 'participants': ['p-blue-id', 'p-red-id']}],
          );
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });

  it('loads values after error pulling game ids', function(done) {
    database.failure = 'getGames';
    instance.reset();
    instance.getByGameId('foobar', false, (game1) => {
      try {
        expect(game1).is.undefined;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('loads values when no game ids', function(done) {
    database.data.delete('foobar');
    instance.getByGameId('foobar', false, (game1) => {
      try {
        expect(game1).is.undefined;
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('loads players that will never exist', async function() {
    const game1 = await instance.getByParticipantId('non-existent-player-id');
    expect(game1).is.undefined;
  });

  it('loads players available later', function(done) {
    instance.getByGameId('foobar', false, (game1) => {
      try {
        expect(game1!.id).to.eq('foobar');
        GameLoader.getInstance().getByParticipantId(foobarGame.getPlayersInGenerationOrder()[0].id).then((game2) => {
          expect(game2!.id).to.eq('foobar');
          done();
        });
      } catch (error) {
        done(error);
      }
    });
  });

  it('waits for games to finish loading', function(done) {
    // Set up a clean number of games;
    database.data.delete('foobar');
    const numberOfGames : number = 10;
    for (let i = 0; i < numberOfGames; i++) {
      const player = new Player('name', Color.BLUE, false, 0, 'p-' + i);
      Game.newInstance('game-' + i, [player], player);
    }
    database.getGameSleep = 500;
    instance.reset();
    instance.getLoadedGameIds((list) => {
      try {
        expect(list?.map((e) => e.id)).to.have.members([
          'game-0', 'game-1', 'game-2', 'game-3', 'game-4',
          'game-5', 'game-6', 'game-7', 'game-8', 'game-9',
        ]);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
