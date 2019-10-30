import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Donation extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Donation";
    public text: string = "Gain 21 MC.";
    public description: string = "From a rich benefactor with absolutely no hidden agenda";
    public play(player: Player, _game: Game) {     
			player.megaCredits += 21;
            return undefined;
    }
}

