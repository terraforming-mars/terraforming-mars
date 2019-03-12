
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Player } from "../Player";
import { CardType } from "./CardType";

export class MagneticFieldDome implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Magnetic Field Dome";
    public text: string = "Decrease your energy production 2 steps and increase your plant production 1 step. Raise your terraform rating 1 step.";
    public description: string = "Protecting a limited area from cosmic radiation.";
    public play(player: Player, _game: Game) {
        if (player.energyProduction < 2) {
            throw "Need 2 energy production to decrease";
        }
        player.energyProduction -= 2;
        player.plantProduction++;
        player.terraformRating++;
        return undefined;
    }
}
