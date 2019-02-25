
import { Game } from "../../Game";
import { ICard } from "../ICard";
import { Player } from "../../Player";
import { PlayerInput } from "../../PlayerInput";

export interface CorporationCard extends ICard {
    initialAction?: (player: Player, game: Game) => PlayerInput;
    startingMegaCredits: number;
    play: (player: Player, game: Game) => undefined;
    action?: (player: Player, game: Game) => undefined;
}
