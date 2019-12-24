import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Donation extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Donation";
    public play(player: Player) {     
        player.megaCredits += 21;
        return undefined;
    }
}

