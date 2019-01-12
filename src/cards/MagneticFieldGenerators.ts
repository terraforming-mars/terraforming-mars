
import { Game } from "../Game";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";

export class MagneticFieldGenerators implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Magnetic Field Generators";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 4 steps and increase your plant production 2 steps. Raise your terraform rating 3 steps";
    public description: string = "By generating a magnetic field, you can protect organisms from cosmic radiation.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.energyProduction < 4) {
                reject("Must have 4 energy production");
                return;
            }
            player.energyProduction -= 4;
            player.plantProduction += 2;
            player.terraformRating += 3;
            resolve();
        });
    }
} 
