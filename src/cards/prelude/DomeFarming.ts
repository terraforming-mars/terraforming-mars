import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class DomeFarming extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = "Dome Farming";
    public text: string = "Increase MC production 2 steps and plant production 1 step.";
    public requirements: undefined;
    public description: string = "Growing flowers of different types, but mainly potatoes...";
    public play(player: Player, _game: Game) {     
			player.plantProduction++;
			player.megaCreditProduction += 2;
            return undefined;
    }
}

