import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class DomeFarming extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = CardName.DOME_FARMING;
    public play(player: Player) {     
        player.setProduction(Resources.PLANTS);
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
}

