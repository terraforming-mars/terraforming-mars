import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class PowerGeneration extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Power Generation";
    public text: string = "Increase your energy production 3 steps.";
    public requirements: undefined;
    public description: string = "A solid base for your energy needs";
    public play(player: Player, _game: Game) {     
        player.energyProduction += 3;
        return undefined;
    }
}

