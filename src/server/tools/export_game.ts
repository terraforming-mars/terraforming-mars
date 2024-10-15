// Exports a game locally for debugging.
// See README.md for instructions.

import * as ansi from 'ansi-escape-sequences';
import {mkdirSync, writeFileSync} from 'fs';
import {GameId, isGameId, isPlayerId, isSpectatorId} from '../../common/Types';
import {Database} from '../database/Database';
import {IDatabase} from '../database/IDatabase';
import {LocalFilesystem} from '../database/LocalFilesystem';
import {exportLogs} from './exportLogs';

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
LocalFilesystem.quiet = true;

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

function showProgressBar(current: number, total: number, width: number = process.stdout.columns ?? 40) {
  const bar = '█';
  const emptyBar = ' ';

  // reserve space for the end
  width = width - 10;

  const filledLength = Math.floor((current / total) * width);
  const emptyLength = width - filledLength;

  const progressString = bar.repeat(filledLength) + emptyBar.repeat(emptyLength);

  const percentage = Math.round((current / total) * 100);

  const ansiEscapeCode = `${ansi.cursor.horizontalAbsolute(0)}${progressString} ${percentage}% ${current}`;
  process.stdout.write(ansiEscapeCode);
}

async function load(gameId: GameId) {
  await localDb.initialize();
  console.log(`Loading game ${gameId}`);
  const game = await db.getGame(gameId);

  console.log(`Last version is ${game.lastSaveId}`);
  let errors = 0;
  let writes = 0;

  const saveIds = await db.getSaveIds(gameId);
  for (const saveId of saveIds) {
    try {
      const serialized = await db.getGameVersion(gameId, saveId);
      showProgressBar(saveId, game.lastSaveId);
      localDb.saveSerializedGame(serialized);
      writes++;
    } catch (err) {
      console.log(`failed to process saveId ${saveId}: ${err}`);
      errors++;
    }
  }

  console.log(); // Necessary because of the ANSI output above.

  try {
    mkdirSync('logs');
  } catch (_) {
    // ignored. Most of the time this isn't a problem.
  }

  const logs = await exportLogs(localDb, gameId);
  const logFilename = `logs/${gameId}.log`;

  writeFileSync(logFilename, logs.join('\n'));
  console.log(`Log at ${logFilename}`);
  console.log(`Wrote ${writes} records and had ${errors} failures.`);
  console.log(`id: ${gameId}`);
}

main();
