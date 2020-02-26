
import { CardType } from "./CardType";
import { ICard } from "./ICard";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";

export interface IProjectCard extends ICard {
    canPlay?: (player: Player, game: Game) => boolean;
    cardType: CardType;
    cost: number;
    resourceType?: ResourceType;
    hasRequirements?: boolean;
}

