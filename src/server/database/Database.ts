import {PostgreSQL} from './PostgreSQL';
import {SQLite} from './SQLite';
import {IDatabase} from './IDatabase';
import {LocalFilesystem} from './LocalFilesystem';
import {MetricsDelegate} from './MetricsDelegate';

export class Database {
  private static instance: IDatabase;

  private constructor() {}

  public static getInstance() {
    if (!Database.instance) {
      Database.instance = new MetricsDelegate(Database.createInstance());
    }
    return Database.instance;
  }

  private static createInstance(): IDatabase {
    if (process.env.POSTGRES_HOST !== undefined) {
      console.log('Connecting to Postgres database.');
      return new PostgreSQL();
    }
    if (process.env.LOCAL_FS_DB !== undefined) {
      console.log('Connecting to local filesystem database.');
      return new LocalFilesystem();
    }
    console.log('Connecting to SQLite database.');
    return new SQLite();
  }
}
