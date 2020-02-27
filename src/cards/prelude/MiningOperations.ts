import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class MiningOperations extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = CardName.MINING_OPERATIONS;
    public play(player: Player) {     
        player.setProduction(Resources.STEEL,2);
        player.steel += 4;
        return undefined;
    }
}

