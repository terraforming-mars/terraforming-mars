import {expect} from 'chai';
import {Database} from '../../src/database/Database';
import {Game} from '../../src/Game';
import {GameLoader} from '../../src/database/GameLoader';
import {Player} from '../../src/Player';

describe('GameLoader', function() {
  let expectedGameIds: Array<string> = [];
  const originalGenerateId = (Player as any).prototype.generateId;
  const originalGetInstance = (Database as any).getInstance;
  let playerIdIndex = 0;

  before(function() {
    (Player as any).prototype.generateId = function() {
      return 'bar-' + (playerIdIndex++);
    };
    (Database as any).getInstance = function() {
      return {
        getGame: function(__gameId: string, theCb: (err: unknown) => void) {
          theCb(undefined);
        },
        getGames: function(getInstanceCb: (err: unknown, allGames: Array<string>) => void) {
          getInstanceCb(undefined, expectedGameIds);
        },
        saveGameState: function() {},
      };
    };
  });

  after(function() {
    (Player as any).prototype.generateId = originalGenerateId;
    (Database as any).getInstance = originalGetInstance;
  });

  it('loads game after loaded from database', function() {
    const expectedGameId = 'foo';
    expectedGameIds = [expectedGameId];
    const loader = new GameLoader();
    let actual: Game | undefined;
    loader.getGameByGameId(expectedGameId, (game) => {
      actual = game;
    });
    expect(actual).to.be.undefined;
    loader.start();
    expect(actual).not.to.be.undefined;
    expect(actual?.id).to.eq(expectedGameId);
    expect(loader.getLoadedGameIds()).to.deep.eq(expectedGameIds);
  });

  it('loads game already loaded from database', function() {
    const expectedGameId = 'foo';
    expectedGameIds = [expectedGameId];
    const loader = new GameLoader();
    loader.start();
    expect(loader.getLoadedGameIds()).to.deep.eq(expectedGameIds);
    let actual: Game | undefined;
    loader.getGameByGameId(expectedGameId, (game) => {
      actual = game;
    });
    expect(actual).not.to.be.undefined;
    expect(actual?.id).to.eq(expectedGameId);
  });

  it('loads player after loaded from database', function() {
    const expectedGameId = 'foo';
    const expectedPlayerId = 'bar-' + playerIdIndex;
    expectedGameIds = [expectedGameId];
    const loader = new GameLoader();
    let actual: Game | undefined;
    loader.getGameByPlayerId(expectedPlayerId, (game) => {
      actual = game;
    });
    expect(actual).to.be.undefined;
    loader.start();
    expect(actual).not.to.be.undefined;
    expect(actual?.id).to.eq(expectedGameId);
  });

  it('loads player already loaded from database', function() {
    const expectedGameId = 'foo';
    const expectedPlayerId = 'bar-' + playerIdIndex;
    expectedGameIds = [expectedGameId];
    const loader = new GameLoader();
    loader.start();
    expect(loader.getLoadedGameIds()).to.deep.eq(expectedGameIds);
    let actual: Game | undefined;
    loader.getGameByPlayerId(expectedPlayerId, (game) => {
      actual = game;
    });
    expect(actual).not.to.be.undefined;
    expect(actual?.id).to.eq(expectedGameId);
  });

  it('provides undefined for players never found after loading', function() {
    const expectedGameId = 'foo';
    const expectedPlayerId = 'never';
    expectedGameIds = [expectedGameId];
    const loader = new GameLoader();
    let actual: Game | string | undefined = 'set';
    loader.getGameByPlayerId(expectedPlayerId, (game) => {
      actual = game;
    });
    loader.start();
    expect(actual).to.be.undefined;
  });

  it('provides undefined for game never found after loading', function() {
    const expectedGameId = 'foo';
    const expectedId = 'never';
    expectedGameIds = [expectedGameId];
    const loader = new GameLoader();
    let actual: Game | string | undefined = 'set';
    loader.getGameByGameId(expectedId, (game) => {
      actual = game;
    });
    loader.start();
    expect(actual).to.be.undefined;
  });
});
