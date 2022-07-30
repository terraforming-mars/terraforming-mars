require('dotenv').config();

import {GameLoader} from '../database/GameLoader';
import {Database} from '../database/Database';

const db = Database.getInstance();

async function main() {
  await db.initialize();
  const loader = GameLoader.getInstance();
  const ledger = await loader.getIds();
  let count = 0;
  for (const entry of ledger) {
    db.storeParticipants({gameId: entry.gameId, participantIds: entry.participantIds})
      .catch((err) => {
        if (err instanceof Error && err.message.includes('duplicate key value')) {
          // ignore
          return;
        }
        console.error(`Could not save ${entry.gameId}: ${err}`);
      }).then(() => {
        count++;
        if (count === ledger.length || count % 1000 === 0) {
          console.log(`Completed ${count} of ${ledger.length}`);
        }
      });
  }
}

main();
