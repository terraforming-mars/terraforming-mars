import {Database} from '../../src/server/database/Database';
import {IDatabase} from '../../src/server/database/IDatabase';
import {SerializedGame} from '../../src/server/SerializedGame';
import {IGameLoader} from '../../src/server/database/IGameLoader';
import {GameLoader} from '../../src/server/database/GameLoader';
import {globalInitialize} from '../../src/server/globalInitialize';

const FAKE_DATABASE: IDatabase = {
  markFinished: () => Promise.resolve(),
  deleteGameNbrSaves: () => Promise.resolve(),
  getPlayerCount: () => Promise.resolve(0),
  getGame: () => Promise.resolve({} as SerializedGame),
  getGameId: () => Promise.resolve('g'),
  getGameVersion: () => Promise.resolve({} as SerializedGame),
  getGameIds: () => Promise.resolve([]),
  getSaveIds: () => Promise.resolve([]),
  initialize: () => Promise.resolve(),
  saveGameResults: () => {},
  saveGame: () => Promise.resolve(),
  purgeUnfinishedGames: () => Promise.resolve([]),
  compressCompletedGames: () => Promise.resolve(),
  stats: () => Promise.resolve({}),

  storeParticipants: () => Promise.resolve(),
  getParticipants: () => Promise.resolve([]),
  createSession: () => Promise.resolve(),
  deleteSession: () => Promise.resolve(),
  getSessions: () => Promise.resolve([]),
};

let databaseUnderTest: IDatabase = FAKE_DATABASE;
export function restoreTestDatabase() {
  setTestDatabase(FAKE_DATABASE);
}
export function setTestDatabase(db: IDatabase) {
  databaseUnderTest = db;
}
Database.getInstance = () => databaseUnderTest;

const defaultGameLoader = GameLoader.getInstance();
let gameLoaderUnderTest: IGameLoader = GameLoader.getInstance();
export function restoreTestGameLoader() {
  setTestGameLoader(defaultGameLoader);
}
export function setTestGameLoader(gameLoader: IGameLoader) {
  gameLoaderUnderTest = gameLoader;
}
GameLoader.getInstance = () => gameLoaderUnderTest;
globalInitialize();
