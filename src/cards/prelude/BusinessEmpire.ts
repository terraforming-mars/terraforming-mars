import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class BusinessEmpire extends PreludeCard implements IProjectCard {

    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Business Empire";
    public text: string = "Increase MC production 6 steps. Pay 6 MC.";
    public requirements: undefined;
    public description: string = "Numerous asset on Earth to support your Mars efforts";
    public play(player: Player, _game: Game) {     
			player.megaCredits -= 6;
			player.megaCreditProduction += 6;
            return undefined;
    }
}

