
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { IUserData } from "../IUserData";

export interface IActiveProjectCard extends IProjectCard {
    needsUserData?: IUserData;
    action: (player: Player, game: Game, userData: IUserData) => void;
}

