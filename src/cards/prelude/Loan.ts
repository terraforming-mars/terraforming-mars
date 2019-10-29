import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Loan extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Loan";
    public text: string = "Gain 30 MC. Decrease your MC production 2 steps.";
    public description: string = "If your outgo exceeds your income, your upkeep will be your downfall";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -3;
    }    
    public play(player: Player, _game: Game) {     
		    player.megaCreditProduction -=2;
			player.megaCredits += 30;
            return undefined;
    }
}

