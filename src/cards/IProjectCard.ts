
import { CardType } from "./CardType";
import { ICard } from "./ICard";

export interface IProjectCard extends ICard {
    animals?: number;
    microbes?: number;
    scienceResources?: number;
    fighterResources?: number;
    cardType: CardType;
    cost: number;
}

