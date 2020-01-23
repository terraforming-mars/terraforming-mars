
import { Game } from "../../Game";
import { ICard } from "../ICard";
import { Player } from "../../Player";
import { PlayerInput } from "../../PlayerInput";
import { OrOptions } from "../../inputs/OrOptions"
import { SelectCard } from "../../inputs/SelectCard";
import { IProjectCard } from "../IProjectCard";
import { ResourceType } from '../../ResourceType';

export interface CorporationCard extends ICard {
    initialAction?: (player: Player, game: Game) => PlayerInput | undefined;
    startingMegaCredits: number;
	play: (player: Player, game: Game) => SelectCard<ICard> | OrOptions | undefined;
    action?: (player: Player, game: Game) => OrOptions | SelectCard<ICard> | undefined;
    onCardPlayed?: (player: Player, game: Game, card: IProjectCard) => void;
    resourceType?: ResourceType;
}

