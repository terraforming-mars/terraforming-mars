import { PostgreSQL } from "./PostgreSQL";
import { SQLite } from "./SQLite";
import { IDatabase } from "./IDatabase";

export class Database {
    private static instance: IDatabase;

    private constructor() {}
  
    public static getInstance() {
        if (!Database.instance) {
            if (process.env.POSTGRES_HOST !== undefined) {
                Database.instance = new PostgreSQL();
            } else {
                Database.instance = new SQLite();
            }
        }
        return Database.instance;
    }
}
