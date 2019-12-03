import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class AlliedBanks extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Allied Banks";
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += 4;
	    player.megaCredits += 3; 
	    return undefined;   
    }
}

