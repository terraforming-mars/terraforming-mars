import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class DomeFarming extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = "Dome Farming";
    public play(player: Player) {     
        player.plantProduction++;
        player.megaCreditProduction += 2;
        return undefined;
    }
}

