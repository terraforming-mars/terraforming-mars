import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class MiningOperations extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mining Operations";
    public play(player: Player) {     
        player.steelProduction += 2;
        player.steel += 4;
        return undefined;
    }
}

