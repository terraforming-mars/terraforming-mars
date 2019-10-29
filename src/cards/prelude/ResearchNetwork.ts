import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class ResearchNetwork extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: string = "Research Network";
    public text: string = "Increase your money production 1 step. Draw 3 cards.";
    public description: string = "Having the right connections for every scientific problem";
    public play(player: Player, game: Game) {     
	    		player.megaCreditProduction++;
			for (let i = 0; i < 3; i++) {
				player.cardsInHand.push(game.dealer.dealCard());
			}
            return undefined;
    }
}

