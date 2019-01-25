
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class BuildingIndustries implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Building Industries";
    public text: string = "Decrease your energy production 1 step and increase your steel production 2 steps";
    public description: string = "Accelerating building of the infrastructure.";
    public play(player: Player, _game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        player.energyProduction--;
        player.steelProduction += 2;
        return Promise.resolve();
    }
} 
