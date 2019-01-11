
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Player } from "../Player";

export interface IProjectCard {
    animals?: number;
    microbes?: number;
    cardType: CardType;
    cost: number;
    tags: Array<Tags>;
    name: string;
    text: string;
    description: string;
    play: (player: Player, game: Game) => void | Promise<void>;
}

