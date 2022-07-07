import {Database} from '../../src/database/Database';
import {IDatabase} from '../../src/database/IDatabase';
import {SerializedGame} from '../../src/SerializedGame';

const FAKE_DATABASE: IDatabase = {
  cleanGame: () => Promise.resolve(),
  deleteGameNbrSaves: () => {},
  getPlayerCount: () => Promise.resolve(0),
  getGame: () => Promise.resolve({} as SerializedGame),
  getGameId: () => Promise.resolve('g'),
  getGameVersion: () => Promise.resolve({} as SerializedGame),
  getGames: () => Promise.resolve([]),
  getSaveIds: () => Promise.resolve([]),
  initialize: () => Promise.resolve(),
  restoreGame: () => {
    throw new Error('game not found');
  },
  loadCloneableGame: () => Promise.resolve({} as SerializedGame),
  saveGameResults: () => {},
  saveGame: () => Promise.resolve(),
  purgeUnfinishedGames: () => {},
  stats: () => Promise.resolve({}),
};

let databaseUnderTest: IDatabase = FAKE_DATABASE;

export function restoreTestDatabase() {
  setTestDatabase(FAKE_DATABASE);
}

export function setTestDatabase(db: IDatabase) {
  databaseUnderTest = db;
}

Database.getInstance = () => databaseUnderTest;
