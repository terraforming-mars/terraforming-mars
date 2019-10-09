import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Biolab extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Biolab";
    public text: string = "Increase your plant production 1 step. Draw 3 cards.";
    public description: string = "Bioengineering is of the utmost importance on Mars, and you just got a headstart";
    public play(player: Player, game: Game) {     
			player.plantProduction++;
			for (let i = 0; i < 3; i++) {
				player.cardsInHand.push(game.dealer.dealCard());
			}
            return undefined;
    }
}

