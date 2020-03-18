import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class OrbitalConstructionYard extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = CardName.ORBITAL_CONSTRUCTION_YARD;
    public play(player: Player) {
        player.setProduction(Resources.TITANIUM);
        player.titanium += 4;	
        return undefined;
    }
}

