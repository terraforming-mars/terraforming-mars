import { IDatabase } from "./IDatabase";
import {Game} from "../Game";

import sqlite3 = require("sqlite3");
const path = require("path");
const fs = require("fs");
const dbFolder = path.resolve(__dirname, "../../../db")
const dbPath = path.resolve(__dirname, "../../../db/game.db");

export class SQLite implements IDatabase {
    private db: sqlite3.Database;
    
    constructor() {
        // Create the table that will store every saves if not exists
        if (!fs.existsSync(dbFolder)){
            fs.mkdirSync(dbFolder);
        }
        this.db = new sqlite3.Database(dbPath);
        this.db.run("CREATE TABLE IF NOT EXISTS games(game_id varchar, save_id integer, game text, PRIMARY KEY (game_id, save_id))");
    }

    cleanSaves(game_id: string, save_id: number): void {
        // DELETE all saves expect last one
        this.db.run("DELETE FROM games WHERE game_id = ? AND save_id < ?", [game_id, save_id], function(err: { message: any; }) {
            if (err) {
            return console.warn(err.message);  
            }
        });
    }
    restoreLastSave(game_id: string, save_id: number, game: Game): void {
        // Retrieve last save from database
        this.db.get("SELECT game game FROM games WHERE game_id = ? AND save_id = ? ORDER BY save_id DESC LIMIT 1", [game_id, save_id],(err: { message: any; }, row: { game: any; }) => {
            if (err) {
            return console.error(err.message);
            }
            // Transform string to json
            let gameToRestore = JSON.parse(row.game);

            // Rebuild each objects
            game.loadFromJSON(gameToRestore);

            return true;
        });
    }
    saveGameState(game_id: string, save_id: number, game: string): void {
        // Insert
        this.db.run("INSERT INTO games(game_id, save_id, game) VALUES(?, ?, ?)", [game_id, save_id, game], function(err: { message: any; }) {
            if (err) {
            return console.log(err.message);  
            }
        });
    }
}