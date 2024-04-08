import {Database} from '../../src/server/database/Database';
import {IDatabase} from '../../src/server/database/IDatabase';
import {SerializedGame} from '../../src/server/SerializedGame';
import {IGameLoader} from '../../src/server/database/IGameLoader';
import {GameLoader} from '../../src/server/database/GameLoader';
import {registerBehaviorExecutor} from '../../src/server/behavior/BehaviorExecutor';
import {Executor} from '../../src/server/behavior/Executor';
import {initializeGlobalEventDealer} from '../../src/server/turmoil/globalEvents/GlobalEventDealer';
import {ALL_MODULE_MANIFESTS} from '../../src/server/cards/AllManifests';

registerBehaviorExecutor(new Executor());

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
initializeGlobalEventDealer(ALL_MODULE_MANIFESTS);
