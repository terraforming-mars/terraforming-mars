import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class HugeAsteroid extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Huge Asteroid";
    public text: string = "Increase Temperature 3 steps. Pay 5 MC.";
    public requirements: undefined;
    public description: string = "Deep impact on Mars before too many move here";
    public play(player: Player, game: Game) {
      player.megaCredits -=5;	
		  return game.increaseTemperature(player, 3);
    }
}

