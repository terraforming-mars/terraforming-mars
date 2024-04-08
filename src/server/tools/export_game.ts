// Exports a game locally for debugging.
// See README.md for instructions.

import {GameId, isGameId, isPlayerId, isSpectatorId} from '../../common/Types';
import {Database} from '../database/Database';
import {IDatabase} from '../database/IDatabase';
import {LocalFilesystem} from '../database/LocalFilesystem';

const args = process.argv.slice(2);
const id = args[0];

if (id === undefined) {
  throw new Error('missing game id');
}
if (process.env.LOCAL_FS_DB !== undefined) {
  throw new Error('Do not run exportGame on local filesystem. Just access the files themselves');
}

const db: IDatabase = Database.getInstance();
const localDb = new LocalFilesystem();

async function getGameId(id: string): Promise<GameId | undefined> {
  if (isGameId(id)) {
    return id;
  }
  if (isPlayerId(id) || isSpectatorId(id)) {
    console.log(`Finding game for player/spectator ${id}`);
    return await db.getGameId(id);
  }
  return undefined;
}

async function main() {
  await db.initialize();
  const gameId = await getGameId(id);
  if (gameId === undefined) {
    console.log('Game is undefined');
    process.exit(1);
  }
  await load(gameId);
}

async function load(gameId: GameId) {
  await localDb.initialize();
  console.log(`Loading game ${gameId}`);
  const game = await db.getGame(gameId);

  console.log(`Last version is ${game.lastSaveId}`);
  let errors = 0;
  let writes = 0;

  // The output might not be returned in order, because the
  // inner call is async, but it is faster than forcing the
  // results to come in order.
  const saveIds = await db.getSaveIds(gameId);
  for (const saveId of saveIds) {
    try {
      const serialized = await db.getGameVersion(gameId, saveId);
      console.log(`Storing version ${saveId}`);
      localDb.saveSerializedGame(serialized);
      writes++;
    } catch (err) {
      console.log(`failed to process saveId ${saveId}: ${err}`);
      errors++;
    }
  }
  console.log(`Wrote ${writes} records and had ${errors} failures.`);
  console.log(`id: ${gameId}`);
}

main();
