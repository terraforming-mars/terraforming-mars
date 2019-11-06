import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class MoholeExcavation extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mohole Excavation";
    public text: string = "Increase your steel production 1 step and your heat production 2 steps. Gain 2 heat.";
    public requirements: undefined;
    public description: string = "Making use of all the minerals you're digging up";
    public play(player: Player, _game: Game) {     
        player.steelProduction++;
        player.heatProduction += 2;
        player.heat += 2;
        return undefined;
    }
}

