import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class SupplyDrop extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Supply Drop";
    public play(player: Player, _game: Game) {
        player.titanium +=3;
        player.steel +=8;
        player.plants +=3;			
        return undefined;
    }
}

