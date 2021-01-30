import {Database} from '../database/Database';
import {Localfilesystem} from '../database/LocalFilesystem';
import {SerializedGame} from '../SerializedGame';
const args = process.argv.slice(2);
const gameId = args[0];

if (gameId === undefined) {
  throw new Error('missing game id');
}
if (process.env.LOCAL_FS_DB !== undefined) {
  throw new Error('Do not run exportGame on local filesystem. Just access the files themselves');
}

const db = Database.getInstance();
const localDb = new Localfilesystem();

console.log(`Loading game ${gameId}`);
db.getGame(gameId, (err: Error | undefined, game?: SerializedGame) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  if (game === undefined) {
    console.log('Game is undefined');
    process.exit(1);
  }

  console.log(`Last version is ${game.lastSaveId}`);
  for (let version = 0; version <= game.lastSaveId; version++) {
    db.getGameVersion(gameId, version, (_err, serialized) => {
      console.log(`Storing version ${version}`);
      localDb.saveSerializedGame(serialized!);
    });
  }
});

