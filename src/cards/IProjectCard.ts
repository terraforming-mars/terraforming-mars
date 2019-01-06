
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Player } from "../Player";
import { IUserData } from "../IUserData";

export interface IProjectCard {
    cardType: CardType;
    cost: number;
    tags: Array<Tags>;
    name: string;
    text: string;
    description: string;
    play: (player: Player, game: Game, userData?: IUserData) => void;
}

