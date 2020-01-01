import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class Mohole extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mohole";
    public play(player: Player) {     
        player.setProduction(Resources.HEAT,3);
        player.heat += 3;
        return undefined;
    }
}

