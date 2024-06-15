// Prints out the entire game log for review.
// e.g. node build/src/server/tools/dump_log.js g4940001dbc
require('dotenv').config();

import {Log} from '../../common/logs/Log';
import {isGameId} from '../../common/Types';
import {Database} from '../database/Database';
import {IDatabase} from '../database/IDatabase';

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
  const saveIds = await db.getSaveIds(gameId);
  let lastIdx = 0;
  for (const saveId of saveIds) {
    const {gameLog} = await db.getGameVersion(gameId, saveId);
    for (let idx = lastIdx; idx < gameLog.length; idx++) {
      const logEntry = gameLog[idx];
      const text = Log.applyData(logEntry, (datum) => datum.value.toString());
      console.log(`[${saveId}/${idx}]: ${text}`);
    }
    lastIdx = gameLog.length;
  }
}

main();
