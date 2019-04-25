
import { CardType } from "./CardType";
import { ICard } from "./ICard";
// import { Player } from "../Player";
// import { Game } from "../Game";

export interface IProjectCard extends ICard {
    animals?: number;
    microbes?: number;
    scienceResources?: number;
    fighterResources?: number;
    cardType: CardType;
//    canPlay: (player: Player, game: Game) => boolean;
    cost: number;
}

