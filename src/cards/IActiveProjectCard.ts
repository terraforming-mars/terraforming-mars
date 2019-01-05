
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";

export interface IActiveProjectCard extends IProjectCard {
    needsUserData?: {[x: string]: string };
    action: (player: Player, game: Game, userData: {[x: string]: string}) => void;
}

