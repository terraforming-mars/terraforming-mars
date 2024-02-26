// Searches through a game's log for an event.
// e.g. node build/src/server/tools/search_log.js g4940001dbc Predators
require('dotenv').config();

import {isGameId} from '../../common/Types';
import {Database} from '../database/Database';
import {IDatabase} from '../database/IDatabase';

const args = process.argv.slice(2);
const [gameId, card] = args;

if (gameId === undefined) {
  throw new Error('missing game id');
}
if (card === undefined) {
  throw new Error('missing card name');
}

const db: IDatabase = Database.getInstance();

async function main() {
  await db.initialize();

  if (!isGameId(gameId)) {
    throw new Error('game ids start with \'g\'');
  }
  const saveIds = await db.getSaveIds(gameId);
  for (const saveId of saveIds) {
    const serialized = await db.getGameVersion(gameId, saveId);
    for (let idx = 0; idx < serialized.gameLog.length; idx++) {
      const logEntry = serialized.gameLog[idx];
      if (logEntry.message === '${0} played ${1}') {
        if (card === logEntry.data[1].value) {
          console.log(`Found at game id ${saveId}, log index ${idx}`);
          console.log(logEntry);
          return;
        }
      }
    }
  }
  console.log('Not found');
}

main();
