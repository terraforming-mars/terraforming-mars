import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class EcologyExperts extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT, Tags.MICROBES];
    public name: string = "Ecology Experts";
    public text: string = "Ignore global requirements for the next card you play this turn. Playing this card does not count as an action. Increase your plant production 1 step.";
    public description: string = "I had no idea that you could actually do that";

    public play(player: Player, _game: Game) {  
	player.reduceActionsTakenThisRound();	
	player.plantProduction++;    
	player.setNoRequirementsWilcard();    
	return undefined;    
    }
}

