
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";

export interface IActiveProjectCard extends IProjectCard {
    actionText: string;
    action: (player: Player, game: Game) => Promise<void>;
}

