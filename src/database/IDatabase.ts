import {Game} from "../Game";

export interface IGameData {
    gameId: string;
    playerCount: number;
}

export interface IDatabase {
    cleanSaves(game_id: string, save_id: number): void;
    restoreGame(game_id: string, save_id: number, game: Game): void;
    restoreGameLastSave(game_id:string, game: Game, cb:(err: any) => void): void;
    saveGameState(game_id: string, save_id: number, game: string, players: number): void;
    getGames(cb:(err: any, allGames:Array<string>) => void): void;
    restoreReferenceGame(game_id:string, game: Game, cb:(err: any) => void): void;
    getClonableGames( cb:(err: any, allGames:Array<IGameData>)=> void) : void;
}