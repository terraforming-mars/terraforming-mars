
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export interface IActionCard {
    actionText: string;
    action: (player: Player, game: Game) => PlayerInput | undefined;
    canAct: (player: Player, game: Game) => boolean;
}

export interface ICard {
    name: string;
    tags: Array<Tags>;
    text: string;
    description: string;
    play: (player: Player, game: Game) => PlayerInput | undefined;
    actionText?: string;
    action?: (player: Player, game: Game) => PlayerInput | undefined;
    canAct?: (player: Player, game: Game) => boolean;
}   
