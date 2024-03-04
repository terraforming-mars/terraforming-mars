// Searches through a game's log for an event.
// e.g. node build/src/server/tools/read_turmoil.js ge120f6729fca
require('dotenv').config();

import {MultiSet} from 'mnemonist';
import {isGameId} from '../../common/Types';
import {Database} from '../database/Database';
import {IDatabase} from '../database/IDatabase';
import {SerializedDelegate} from '../turmoil/SerializedTurmoil';

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
  for (const saveId of saveIds) {
    const serialized = await db.getGameVersion(gameId, saveId);
    const turmoil = serialized.turmoil;
    if (turmoil === undefined) {
      throw new Error('!');
    }
    const set = new MultiSet<SerializedDelegate>();
    if (turmoil.chairman) set.add(turmoil.chairman);
    turmoil.lobby?.forEach((delegate) => set.add(delegate));
    turmoil.delegateReserve.forEach((delegate) => set.add(delegate));
    turmoil.parties.forEach((party) => {
      party.delegates.forEach((delegate) => set.add(delegate));
    });
    console.log('       ', Array.from(set.multiplicities()).sort().join(', '));
    console.log();
  }
  console.log('Not found');
}

main();
