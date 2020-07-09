import { IDatabase } from "./IDatabase";
import { Game } from "../Game";
import { IGameData } from './IDatabase';

import { Client, ClientConfig } from "pg";

export class PostgreSQL implements IDatabase {
    private client: Client;
    
    constructor() {
        const config: ClientConfig = {
            connectionString: process.env.POSTGRES_HOST
        };
        if (config.connectionString !== undefined && config.connectionString.startsWith("postgres")) {
            config.ssl = {
                // heroku uses self-signed certificates
                rejectUnauthorized: false
            };
        }
        this.client = new Client(config);
        this.client.connect();
        this.client.query("CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default 'running', created_time timestamp default now(), PRIMARY KEY (game_id, save_id))", (err) => {
            if (err) {
                throw err;
            }
            console.log("Connected to PostgreSQL");
        });
        this.client.query("CREATE INDEX IF NOT EXISTS games_i1 on games(save_id)", (err) => {
            if (err) {
                throw err;
            }
            console.log("Connected to PostgreSQL");
        });        
    }

    getClonableGames( cb:(err: any, allGames:Array<IGameData>)=> void) {
        const allGames:Array<IGameData> = [];
        const sql = "SELECT distinct game_id game_id, players players FROM games WHERE status = 'running' and save_id = 0 order by game_id asc";

        this.client.query(sql, (err, res) => {
            if (err) {
                console.error("PostgreSQL:getClonableGames", err);
                cb(err, []);
                return;
            }
            for (const row of res.rows) {
                const gameId:string = row.game_id;
                const playerCount: number = row.players;
                const gameData:IGameData = {
                    gameId,
                    playerCount
                };
                allGames.push(gameData);
            }
            cb(undefined, allGames);
        });
    }

    getGames(cb:(err: any, allGames:Array<string>)=> void) {
        const allGames:Array<string> = [];
        const sql: string = "SELECT distinct game_id game_id FROM games WHERE status = 'running' and save_id > 0";
        this.client.query(sql, (err, res) => {
            if (err) {
                console.error("PostgreSQL:getGames", err);
                cb(err, []);
                return;
            }
            for (const row of res.rows) {
                allGames.push(row.game_id);
            }
            cb(undefined, allGames);
        });
    }

    restoreReferenceGame(game_id:string, game: Game, cb:(err: any) => void) {
        // Retrieve first save from database
        this.client.query("SELECT game_id game_id, game game FROM games WHERE game_id = $1 AND save_id = 0", [game_id], (err: any, res) => {
            if (err) {
                console.error("PostgreSQL:restoreReferenceGame", err);
                return cb(err);
            }
            if (res.rows.length === 0) {
                return cb(new Error("Game not found"));
            }
            // Transform string to json
            let gameToRestore = JSON.parse(res.rows[0].game);

            // Rebuild each objects
            game.loadFromJSON(gameToRestore);

            return cb(err);
        });
    }

    restoreGameLastSave(game_id:string, game: Game, cb:(err: any) => void) {
        // Retrieve last save from database
        this.client.query("SELECT game game FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT 1", [game_id], (err, res) => {
            if (err) {
                console.error("PostgreSQL:restoreGameLastSave", err);
                return cb(err);
            }
            if (res.rows.length === 0) {
                return cb(new Error("Game not found"));
            }
            // Transform string to json
            let gameToRestore = JSON.parse(res.rows[0].game);

            // Rebuild each objects
            try {
                game.loadFromJSON(gameToRestore);
            } catch (e) {
                cb(e);
                return;
            }

            return cb(err);
        });
    }

    cleanSaves(game_id: string, save_id: number): void {
        // DELETE all saves except initial and last one
        this.client.query("DELETE FROM games WHERE game_id = $1 AND save_id < $2 AND save_id > 0", [game_id, save_id], (err) => {
            if (err) {
                console.error("PostgreSQL:cleanSaves", err);
                throw err;
            }
            // Flag game as finished
            this.client.query("UPDATE games SET status = 'finished' WHERE game_id = $1", [game_id], (err2) => {
                if (err2) {
                    console.error("PostgreSQL:cleanSaves2", err2);
                    throw err2;
                }
            });
        });
    }

    restoreGame(game_id: string, save_id: number, game: Game): void {
        // Retrieve last save from database
        this.client.query("SELECT game game FROM games WHERE game_id = $1 AND save_id = $2 ORDER BY save_id DESC LIMIT 1", [game_id, save_id], (err, res) => {
            if (err) {
                return console.error("PostgreSQL:restoreGame", err);
            }
            if (res.rows.length === 0) {
                console.error("PostgreSQL:restoreGame", "Game not found");
                return;
            }

            // Transform string to json
            let gameToRestore = JSON.parse(res.rows[0].game);

            // Rebuild each objects
            game.loadFromJSON(gameToRestore);
        });
    }

    saveGameState(game_id: string, save_id: number, game: string, players: number): void {
        // Insert
        this.client.query("INSERT INTO games(game_id, save_id, game, players) VALUES($1, $2, $3, $4)", [game_id, save_id, game, players], (err) => {
            if (err) {
                //Should be a duplicate, does not matter
                return;
            }
        });
    }
}
