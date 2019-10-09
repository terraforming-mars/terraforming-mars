import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class MetalsCompany extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Metals Company";
    public text: string = "Increase your MC, steel and titanium production 1 step.";
    public description: string = "Your accreditation to this company connects you to the whole metal market";
    public play(player: Player, _game: Game) {     
		    player.megaCreditProduction++;
			player.titaniumProduction++;
			player.steelProduction++;			
            return undefined;
    }
}

