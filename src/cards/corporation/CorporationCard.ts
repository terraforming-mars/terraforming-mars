
import { Game } from "../../Game";
import { ICard } from "../ICard";
import { Player } from "../../Player";
import { PlayerInput } from "../../PlayerInput";
import { OrOptions } from "../../inputs/OrOptions"
import { SelectCard } from "../../inputs/SelectCard";
import { IProjectCard } from "../IProjectCard";


export interface CorporationCard extends ICard {
    initialAction?: (player: Player, game: Game) => PlayerInput;
    startingMegaCredits: number;
	play: (player: Player, game: Game) => SelectCard<IProjectCard> | OrOptions | undefined;
    action?: (player: Player, game: Game) => OrOptions | undefined;
}


