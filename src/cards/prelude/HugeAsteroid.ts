import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class HugeAsteroid extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Huge Asteroid";
    public play(player: Player, game: Game) {
      player.megaCredits -=5;	
		  return game.increaseTemperature(player, 3);
    }
}

