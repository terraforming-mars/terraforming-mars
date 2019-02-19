
import { Game } from "../../Game";
import { ICard } from "../ICard";
import { Player } from "../../Player";

export interface CorporationCard extends ICard {
    initialAction?: (player: Player, game: Game) => Promise<void>;
    startingMegaCredits: number;
}
