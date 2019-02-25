
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export interface ICard {
    name: string;
    tags: Array<Tags>;
    text: string;
    description: string;
    play: (player: Player, game: Game) => PlayerInput | undefined;
    actionText?: string;
    action?: (player: Player, game: Game) => PlayerInput | undefined;
}   
