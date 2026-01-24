// Prints out the entire game log for review.
// e.g. node build/src/server/tools/dump_log.js g4940001dbc
require('dotenv').config();

import {isGameId} from '../../common/Types';
import {Database} from '../database/Database';
import {IDatabase} from '../database/IDatabase';
import {exportLogs} from './exportLogs';

const args = process.argv.slice(2);
const [gameId] = args;

if (gameId === undefined) {
  throw new Error('missing game id');
}

const db: IDatabase = Database.getInstance();

async function main() {
  await db.initialize();

  if (!isGameId(gameId)) {
    throw new Error('game ids start with \'g\'');
  }
  const logs = await exportLogs(db, gameId);
  for (const entry of logs) {
    console.log(entry);
  }
}

main();
