import {Game} from "../Game";
import { User } from "../User";

export interface IGameData {
    gameId: string;
    playerCount: number;
}

export interface IDatabase {
    cleanSaves(game_id: string, save_id: number): void;
    cleanGame(game_id: string): void;
    cleanGameSave(game_id: string, save_id: number): void;
    restoreGame(game_id: string, save_id: number, game: Game): void;
    restoreGameLastSave(game_id:string, game: Game, cb:(err: any) => void): void;
    saveGameState(game_id: string, save_id: number, game: string): void;
    getGames(cb:(err: any, allGames:Array<string>) => void): void;
    restoreReferenceGame(game_id:string, game: Game, cb:(err: any) => void): void;
    getClonableGames( cb:(err: any, allGames:Array<IGameData>)=> void) : void;
    saveUser(id: string, name: string, password: string): void ;
    getUsers(cb:(err: any, allUsers:Array<User>)=> void): void ;
}