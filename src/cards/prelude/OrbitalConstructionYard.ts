import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';

export class OrbitalConstructionYard extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Orbital Construction Yard";
    public play(player: Player) {
        player.setProduction(Resources.TITANIUM);
        player.titanium += 4;	
        return undefined;
    }
}

