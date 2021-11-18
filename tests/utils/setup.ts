import {Database} from '../../src/database/Database';
import {IDatabase} from '../../src/database/IDatabase';

const FAKE_DATABASE: IDatabase = {
  cleanSaves: () => Promise.resolve(),
  deleteGameNbrSaves: () => {},
  getClonableGames: () => {},
  getGame: () => {},
  getGameId: () => {},
  getGameVersion: () => {},
  getGames: () => {},
  initialize: () => Promise.resolve(),
  restoreGame: () => {},
  loadCloneableGame: () => {},
  saveGameResults: () => {},
  saveGame: () => Promise.resolve(),
  purgeUnfinishedGames: () => Promise.resolve(),
};

let databaseUnderTest: IDatabase = FAKE_DATABASE;

export function restoreTestDatabase() {
  databaseUnderTest = FAKE_DATABASE;
}

Database.getInstance = function() {
  // don't save to database during tests
  return databaseUnderTest;
};

