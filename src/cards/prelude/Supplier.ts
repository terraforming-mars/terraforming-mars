import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class Supplier extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Supplier";
    public play(player: Player) {
        player.setProduction(Resources.ENERGY,2);
        player.steel +=4;
        return undefined;
    }
}

