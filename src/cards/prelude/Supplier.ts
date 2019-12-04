import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class Supplier extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Supplier";
    public play(player: Player, _game: Game) {
        player.energyProduction +=2;
        player.steel +=4;
        return undefined;
    }
}

