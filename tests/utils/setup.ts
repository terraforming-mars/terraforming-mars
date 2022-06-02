import {Database} from '../../src/database/Database';
import {IDatabase} from '../../src/database/IDatabase';
import {SerializedGame} from '../../src/SerializedGame';

const FAKE_DATABASE: IDatabase = {
  cleanSaves: () => {},
  deleteGameNbrSaves: () => {},
  getPlayerCount: () => {},
  getGame: () => {},
  getGameId: () => {},
  getGameVersion: () => Promise.resolve({} as SerializedGame),
  getGames: () => Promise.resolve([]),
  initialize: () => Promise.resolve(),
  restoreGame: () => {},
  loadCloneableGame: () => {},
  saveGameResults: () => {},
  saveGame: () => Promise.resolve(),
  purgeUnfinishedGames: () => {},
  stats: () => Promise.resolve({}),
};

let databaseUnderTest: IDatabase = FAKE_DATABASE;

export function restoreTestDatabase() {
  databaseUnderTest = FAKE_DATABASE;
}

Database.getInstance = function() {
  // don't save to database during tests
  return databaseUnderTest;
};

