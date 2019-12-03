import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class SmeltingPlant extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Smelting Plant";
    public play(player: Player, game: Game) {     
        player.steel += 5;
        return game.increaseOxygenLevel(player, 2);
    }
}

