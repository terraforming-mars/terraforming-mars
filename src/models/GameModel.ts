
import { Color } from "../Color";
import { Phase } from "../Phase";

export interface GameModel {
    activePlayer: Color;
    id: string;
    phase: Phase;
    players: Array<GamePlayerModel>;
}

export interface GamePlayerModel {
    color: Color;
    id: string;
    name: string;
}
