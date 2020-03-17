import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Biofuels extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = CardName.BIOFUELS;
    public play(player: Player) {     
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.PLANTS);
        player.plants += 2;
        return undefined;
    }
}

