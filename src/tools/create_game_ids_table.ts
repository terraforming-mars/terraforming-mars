require('dotenv').config();

import {GameLoader} from '../database/GameLoader';
import {Database} from '../database/Database';

const db = Database.getInstance();

async function main() {
  const loader = GameLoader.getInstance();
  const ledger = await loader.getIds();
  let count = 0;
  for (const entry of ledger) {
    db.storeParticipants({gameId: entry.gameId, participantIds: entry.participantIds})
      .catch((err) => {
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
