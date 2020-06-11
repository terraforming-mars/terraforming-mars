
import { CardType } from "./CardType";
import { ICard } from "./ICard";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { Resources } from '../Resources';

export interface IProjectCard extends ICard {
    canPlay?: (player: Player, game: Game, bonusMc?: number) => boolean;
    cardType: CardType;
    cost: number;
    resourceType?: ResourceType;
    hasRequirements?: boolean;
    bonusResource?: Resources | undefined;
    bonusMc?: number | undefined;
}

