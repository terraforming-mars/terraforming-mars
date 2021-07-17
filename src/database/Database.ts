import {PostgreSQL} from './PostgreSQL';
import {SQLite} from './SQLite';
import {IDatabase} from './IDatabase';
import {Localfilesystem} from './LocalFilesystem';

export class Database {
    private static instance: IDatabase;

    private constructor() {}

    public static getInstance() {
      if (!Database.instance) {
        if (process.env.POSTGRES_HOST !== undefined) {
          console.log('Connecting to Postgres database.');
          Database.instance = new PostgreSQL();
        } else if (process.env.LOCAL_FS_DB !== undefined) {
          console.log('Connecting to local filesystem database.');
          Database.instance = new Localfilesystem();
        } else {
          console.log('Connecting to SQLite database.');
          Database.instance = new SQLite();
        }
      }
      return Database.instance;
    }
}
