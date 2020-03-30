import {Game} from "../Game";

export interface IDatabase {
    cleanSaves(game_id: string, save_id: number): void;
    restoreLastSave(game_id: string, save_id: number, game: Game): void;
    saveGameState(game_id: string, save_id: number, game: string): void;
}