import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class GalileanMining extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: string = "Galilean Mining";
    public canPlay(player: Player) {
        return player.canAfford(5);
    }
    public play(player: Player) {
        player.titaniumProduction += 2;
        player.megaCredits -= 5;
        return undefined;
    }
}

