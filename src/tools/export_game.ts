// Exports a game locally for debugging.
// See README.md for instructions.

import {isPlayerId, isSpectatorId} from '../common/utils/utils';
import {Database} from '../database/Database';
import {Localfilesystem} from '../database/LocalFilesystem';
import {SerializedGame} from '../SerializedGame';
const args = process.argv.slice(2);
const id = args[0];

if (id === undefined) {
  throw new Error('missing game id');
}
if (process.env.LOCAL_FS_DB !== undefined) {
  throw new Error('Do not run exportGame on local filesystem. Just access the files themselves');
}

const db = Database.getInstance();
const localDb = new Localfilesystem();

if (isPlayerId(id) || isSpectatorId(id)) {
  console.log(`Finding game for player/spectator ${id}`);
  db.getGameId(id)
    .then((gameId) => {
      if (gameId === undefined) {
        console.log('Game is undefined');
        process.exit(1);
      }
      load(gameId);
    }).catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

function load(gameId: string) {
  console.log(`Loading game ${gameId}`);
  db.getGame(gameId, async (err: Error | undefined, game?: SerializedGame) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    if (game === undefined) {
      console.log('Game is undefined');
      process.exit(1);
    }

    console.log(`Last version is ${game.lastSaveId}`);
    let errors = 0;
    let writes = 0;

    // The output might not be returned in order, because the
    // inner call is async, but it is faster than forcing the
    // results to come in order.
    db.getSaveIds(gameId)
      .then((saveIds) => {
        saveIds.forEach((saveId) => {
          db.getGameVersion(gameId, saveId)
            .then((serialized) => {
              console.log(`Storing version ${saveId}`);
              localDb.saveSerializedGame(serialized!);
              writes++;
            }).catch((err) => {
              console.log(`failed to process saveId ${saveId}: ${err}`);
              errors++;
            });
          if (errors + writes === saveIds.length) {
            // This is the last one.
            console.log(`Wrote ${writes} records and had ${errors} failures.`);
          }
        });
      });
  });
}
