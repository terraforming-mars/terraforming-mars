import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class PowerGeneration extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: CardName = CardName.POWER_GENERATION;
    public play(player: Player) {     
        player.addProduction(Resources.ENERGY, 3);
        return undefined;
    }
}
