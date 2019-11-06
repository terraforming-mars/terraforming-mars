
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
    public requirements: undefined;
    public description: string = "By generating a magnetic field, you can protect organisms from cosmic radiation.";
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 4;
    }
    public play(player: Player, _game: Game) {
        if (player.energyProduction < 4) {
            throw "Must have 4 energy production";
        }
        player.energyProduction -= 4;
        player.plantProduction += 2;
        player.terraformRating += 3;
        return undefined;
    }
} 
