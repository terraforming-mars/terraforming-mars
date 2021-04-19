import {expect} from 'chai';
import {Database} from '../../src/database/Database';
import {Game} from '../../src/Game';
import {GameLoader} from '../../src/database/GameLoader';
import {Player} from '../../src/Player';
import {SerializedGame} from '../../src/SerializedGame';
import {TestPlayers} from '../TestPlayers';

describe('GameLoader', function() {
  const expectedGameIds: Array<string> = ['alpha', 'foobar'];
  const originalGenerateId = (Player as any).prototype.generateId;
  const originalGetInstance = (Database as any).getInstance;
  const player = TestPlayers.BLUE.newPlayer();
  const player2 = TestPlayers.RED.newPlayer();
  const game = Game.newInstance('foobar', [player, player2], player);
  let playerIdIndex = 0;

  before(function() {
    (Player as any).prototype.generateId = function() {
      return 'bar-' + (playerIdIndex++);
    };
    const database = {
      getGame: function(gameId: string, theCb: (err: unknown, serializedGame?: SerializedGame) => void) {
        if (gameId === 'foobar') {
          theCb(undefined, game.serialize());
        } else {
          theCb(undefined, undefined);
        }
      },
      getGames: function(getInstanceCb: (err: unknown, allGames: Array<string>) => void) {
        getInstanceCb(undefined, expectedGameIds);
      },
      saveGame: function() {},
    };
    (Database as any).getInstance = function() {
      return database;
    };
  });
  beforeEach(function() {
    (GameLoader.getInstance() as GameLoader).reset();
  });
  after(function() {
    (Player as any).prototype.generateId = originalGenerateId;
    (Database as any).getInstance = originalGetInstance;
  });

  it('uses shared instance', function() {
    expect(GameLoader.getInstance()).to.eq(GameLoader.getInstance());
  });

  it('gets undefined when game will never exist', function() {
    let actualGame1: Game | undefined = game;
    let actualGame2: Game | undefined = game;
    GameLoader.getInstance().getByPlayerId('foobar', (game1) => {
      actualGame1 = game1;
    });
    GameLoader.getInstance().getByPlayerId('never', (game2) => {
      actualGame2 = game2;
    });
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      expect(game1).not.is.undefined;
    });
    expect(actualGame1).is.undefined;
    expect(actualGame2).is.undefined;
  });

  it('gets game when it exists in database', function() {
    let actualGame1: Game | undefined = undefined;
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      actualGame1 = game1;
    });
    expect(actualGame1!.id).to.eq(game.id);
  });

  it('gets no game when fails to deserialize from database', function() {
    let actualGame1: Game | undefined = game;
    const originalDeserialize = Game.deserialize;
    Game.deserialize = function() {
      throw 'could not parse this';
    };
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      actualGame1 = game1;
    });
    expect(actualGame1).is.undefined;
    Game.deserialize = originalDeserialize;
  });

  it('gets game when requested before database loaded', function(done) {
    const workingGetGames = Database.getInstance().getGames;
    Database.getInstance().getGames = function(cb: (err: any, games: Array<string>) => void) {
      setTimeout(function() {
        cb(undefined, ['foobar']);
      });
    };
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      expect(game1).not.is.undefined;
    });
    GameLoader.getInstance().getByGameId('never', false, (game1) => {
      expect(game1).is.undefined;
    });
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      expect(game1).not.is.undefined;
    });
    GameLoader.getInstance().getByPlayerId(game.getPlayers()[0].id, (game1) => {
      expect(game1).not.is.undefined;
      done();
    });
    Database.getInstance().getGames = workingGetGames;
  });

  it('gets no game when game goes missing from database', function() {
    const originalGetGame = Database.getInstance().getGame;
    GameLoader.getInstance().getByGameId('never', false, (game1) => {
      expect(game1).is.undefined;
      Database.getInstance().getGame = function(_gameId: string, cb: (err: any, serializedGame?: SerializedGame) => void) {
        cb(undefined, undefined);
      };
    });
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      expect(game1).is.undefined;
    });
    Database.getInstance().getGame = originalGetGame;
  });

  it('loads games requested before database loaded', function() {
    const originalGetGame = Database.getInstance().getGame;
    GameLoader.getInstance().getByGameId('never', false, (game1) => {
      expect(game1).is.undefined;
      Database.getInstance().getGame = function(_gameId: string, cb: (err: any, serializedGame?: SerializedGame) => void) {
        cb(undefined, undefined);
      };
    });
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      expect(game1).is.undefined;
    });
    Database.getInstance().getGame = originalGetGame;
  });

  it('gets player when it exists in database', function() {
    let actualGame1: Game | undefined = undefined;
    const players = game.getPlayers();
    GameLoader.getInstance().getByPlayerId(players[Math.floor(Math.random() * players.length)].id, (game1) => {
      actualGame1 = game1;
    });
    expect(actualGame1!.id).to.eq(game.id);
  });

  it('gets game when added and not in database', function() {
    let actualGame1: Game | undefined = undefined;
    game.id = 'alpha';
    GameLoader.getInstance().add(game);
    GameLoader.getInstance().getByGameId('alpha', false, (game1) => {
      actualGame1 = game1;
    });
    expect(actualGame1!.id).to.eq('alpha');
    game.id = 'foobar';
  });

  it('gets player when added and not in database', function() {
    const players = game.getPlayers();
    GameLoader.getInstance().add(game);
    GameLoader.getInstance().getByPlayerId(players[Math.floor(Math.random() * players.length)]!.id, (game1) => {
      expect(game1).not.is.undefined;
    });
    expect(GameLoader.getInstance().getLoadedGameIds()).to.deep.eq(
      [{'id': 'foobar', 'participants': ['blue-id', 'red-id']}],
    );
  });

  it('loads values after error pulling game ids', function() {
    const workingGetGames = Database.getInstance().getGames;
    Database.getInstance().getGames = function(cb: (err: any, games: Array<string>) => void) {
      cb('error', []);
    };
    let actualGame1: Game | undefined = game;
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      actualGame1 = game1;
    });
    expect(actualGame1).is.undefined;
    Database.getInstance().getGames = workingGetGames;
  });

  it('loads values when no game ids', function() {
    const workingGetGames = Database.getInstance().getGames;
    Database.getInstance().getGames = function(cb: (err: any, games: Array<string>) => void) {
      cb(undefined, []);
    };
    let actualGame1: Game | undefined = game;
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      actualGame1 = game1;
    });
    expect(actualGame1).is.undefined;
    Database.getInstance().getGames = workingGetGames;
  });

  it('loads players that will never exist', function(done) {
    const workingGetGames = Database.getInstance().getGames;
    Database.getInstance().getGames = function(cb: (err: any, games: Array<string>) => void) {
      setTimeout(function() {
        cb(undefined, []);
      });
    };
    GameLoader.getInstance().getByPlayerId('foobar', (game1) => {
      expect(game1).is.undefined;
      Database.getInstance().getGames = workingGetGames;
      done();
    });
  });

  it('loads players available later', function(done) {
    const workingGetGames = Database.getInstance().getGames;
    Database.getInstance().getGames = function(cb: (err: any, games: Array<string>) => void) {
      setTimeout(function() {
        cb(undefined, ['foobar']);
      });
    };
    GameLoader.getInstance().getByGameId('foobar', false, (game1) => {
      expect(game1!.id).to.eq('foobar');
    });
    GameLoader.getInstance().getByPlayerId(game.getPlayers()[0].id, (game1) => {
      expect(game1!.id).to.eq('foobar');
      Database.getInstance().getGames = workingGetGames;
      done();
    });
  });
});
