
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export interface ICard {
    name: string;
    tags: Array<Tags>;
    text: string;
    description: string;
    play: (player: Player, game: Game) => Promise<void>;
}   
