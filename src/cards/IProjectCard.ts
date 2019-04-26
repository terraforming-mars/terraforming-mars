
import { CardType } from "./CardType";
import { ICard } from "./ICard";
import { Player } from "../Player";
import { Game } from "../Game";

export interface IProjectCard extends ICard {
    animals?: number;
    canPlay: (player: Player, game: Game) => boolean;
    cardType: CardType;
    cost: number;
    fighterResources?: number;
    microbes?: number;
    scienceResources?: number;
}

