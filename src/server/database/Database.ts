import {PostgreSQL} from '@/server/database/PostgreSQL';
import {SQLite} from '@/server/database/SQLite';
import {IDatabase} from '@/server/database/IDatabase';
import {LocalFilesystem} from '@/server/database/LocalFilesystem';
import {LocalStorage} from '@/server/database/LocalStorage';

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
        Database.instance = new LocalFilesystem();
      } else if (process.env.LOCAL_STORAGE_DB !== undefined) {
        console.log('Connecting to local storage database.');
        Database.instance = new LocalStorage();
      } else {
        console.log('Connecting to SQLite database.');
        Database.instance = new SQLite();
      }
    }
    return Database.instance;
  }
}
