import { SQLite } from "./SQLite";
import { IDatabase } from "./IDatabase";

export class Database {
    private static instance: IDatabase;

    private constructor() {}
  
    public static getInstance() {
        if (!Database.instance) {
            Database.instance = new SQLite();
        }

        return Database.instance;
    }
  
  }