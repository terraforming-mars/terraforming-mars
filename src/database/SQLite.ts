import { IDatabase } from "./IDatabase";
import {Game} from "../Game";
import { IGameData } from "./IDatabase";

import sqlite3 = require("sqlite3");
import { User } from "../User";
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
        this.db.run("CREATE TABLE IF NOT EXISTS games(game_id varchar, save_id integer, game text, status text default 'running',createtime timestamp default (datetime(CURRENT_TIMESTAMP,'localtime')), PRIMARY KEY (game_id, save_id))");
        this.db.run("CREATE TABLE IF NOT EXISTS 'users'('id'  varchar NOT NULL,'name'  varchar NOT NULL,'password'  varchar NOT NULL,'createtime'  timestamp DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),PRIMARY KEY ('id'))");
    }

    getClonableGames( cb:(err: any, allGames:Array<IGameData>)=> void) {
        var allGames:Array<IGameData> = [];
        var sql = "SELECT distinct game_id game_id, game FROM games WHERE status = 'running' and save_id = 0 order by game_id asc";
  
        this.db.all(sql, [], (err, rows) => {
            if (rows) {
                rows.forEach((row) => {
                    let gameId:string = row.game_id;
                    let playerCount: number = JSON.parse(row.game).players.length;
                    let gameData:IGameData = {
                        gameId,
                        playerCount
                    };
                    allGames.push(gameData);
                });
                return cb(err, allGames);
            }
        });
    }  

    getGames(cb:(err: any, allGames:Array<string>)=> void) {
        var allGames:Array<string> = [];
        var sql: string = "SELECT distinct game_id game_id FROM games "; 
        this.db.all(sql, [], (err, rows) => {
            if (rows) {
                rows.forEach((row) => {
                    allGames.push(row.game_id);
                });
                return cb(err, allGames);
            }
        });
    }

    restoreReferenceGame(game_id:string, game: Game, cb:(err: any) => void) {
        // Retrieve first save from database
        this.db.get("SELECT game_id game_id, game game FROM games WHERE game_id = ? AND save_id = 0", [game_id],(err: { message: any; }, row: { game_id: string, game: any; }) => {
            if (row.game_id === undefined) {
                return cb(new Error("Game not found"));
            }
            // Transform string to json
            let gameToRestore = JSON.parse(row.game);

            // Rebuild each objects
            game.loadFromJSON(gameToRestore);

            return cb(err);
        });
    }      

    restoreGameLastSave(game_id:string, game: Game, cb:(err: any) => void) {
        // Retrieve last save from database
        this.db.get("SELECT game game ,createtime createtime  FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT 1", [game_id],(err: { message: any; }, row: { game: any, createtime: any; }) => {
            if (err) {
                return cb(err);
            }
            // Transform string to json
            let gameToRestore = JSON.parse(row.game);

            // Rebuild each objects
            try {
                game.loadFromJSON(gameToRestore);
                game.updatetime = row.createtime;
            } catch (e) {
                cb(e);
                return;
            }
            return cb(err);
        });
    }

    cleanSaves(game_id: string, save_id: number): void {
        // DELETE all saves except initial and last one
        this.db.run("DELETE FROM games WHERE game_id = ? AND save_id < ? AND save_id > 0", [game_id, save_id], function(err: { message: any; }) {
            if (err) {
                return console.warn(err.message);  
            }
        });
        // Flag game as finished
        this.db.run("UPDATE games SET status = 'finished' WHERE game_id = ?", [game_id], function(err: { message: any; }) {
            if (err) {
                return console.warn(err.message);  
            }
        });        
    }

    cleanGame(game_id: string): void {
        // DELETE all saves 
        this.db.run("DELETE FROM games WHERE game_id = ? ", [game_id], function(err: { message: any; }) {
            if (err) {
                return console.warn(err.message);  
            }
        });
    }
    
    cleanGameSave(game_id: string, save_id: number): void {
        // DELETE one  save  by save id
        this.db.run("DELETE FROM games WHERE game_id = ? AND save_id = ?", [game_id, save_id], function(err: { message: any; }) {
            if (err) {
                return console.warn(err.message);  
            }
        });
    }

    restoreGame(game_id: string, save_id: number, game: Game): void {
        // Retrieve last save from database
        this.db.get("SELECT game game ,createtime createtime  FROM games WHERE game_id = ? AND save_id = ? ORDER BY save_id DESC LIMIT 1", [game_id, save_id],(err: { message: any; }, row: { game: any, createtime: any; }) => {
            if (err) {
                return console.error(err.message);
            }
            // Transform string to json
            let gameToRestore = JSON.parse(row.game);

            // Rebuild each objects
            game.loadFromJSON(gameToRestore);
            game.updatetime = row.createtime;
            
            return true;
        });
    }

    saveGameState(game_id: string, save_id: number, game: string): void {
        // Insert
        this.db.run("INSERT INTO games(game_id, save_id, game) VALUES(?, ?, ?)", [game_id, save_id, game], function(err: { message: any; }) {
            if (err) {
                //Should be a duplicate, does not matter
                return;  
            }
        });
    }

    saveUser(id: string, name: string, password: string): void {
        // Insert user
        this.db.run("INSERT INTO users(id, name, password) VALUES(?, ?, ?)", [id, name, password], function(err: { message: any; }) {
            if (err) {
                return console.error(err);  
            }
        });
    }

    getUsers(cb:(err: any, allUsers:Array<User>)=> void): void {
        var allUsers:Array<User> = [];
        var sql: string = "SELECT distinct id, name, password FROM users "; 
        this.db.all(sql, [], (err, rows) => {
            if (rows) {
                rows.forEach((row) => {
                    allUsers.push( {id: row.id, name: row.name, password: row.password} as User);
                });
                return cb(err, allUsers);
            }
        });
    }
}