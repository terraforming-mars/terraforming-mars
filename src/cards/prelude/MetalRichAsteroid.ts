import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class MetalRichAsteroid extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Metal-Rich Asteroid";
    public text: string = "Increase temperature 1 step. Gain 4 titanium and 4 steel.";
    public requirements: undefined;
    public description: string = "Metal delivery. Without brakes";
    public play(player: Player, game: Game) {
		player.titanium += 4;
		player.steel += 4;
		return game.increaseTemperature(player, 1);
    }
}

