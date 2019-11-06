import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class AlliedBanks extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Allied Banks";
    public text: string = "Raise MC production 4 steps. Gains 3 MC.";
    public requirements: undefined;
    public description: string = "We are benefited by human bank savings";
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += 4;
	    player.megaCredits += 3; 
	    return undefined;   
    }
}

