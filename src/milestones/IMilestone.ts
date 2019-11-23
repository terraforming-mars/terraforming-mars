import { Player } from "../Player";
import { Game } from "../Game";

export interface IMilestone {
    name: string;
    canClaim: (player: Player, game: Game) => boolean;   
}