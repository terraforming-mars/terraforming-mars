
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";

export class EquatorialMagnetizer implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Equatorial Magnetizer";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public actionText: string = "Decrease your energy production 1 step to increase your terraform rating 1 step.";
    public description: string = "Super-conducting wires encircling the globe to create a magnetic field.";
    public play(_player: Player, _game: Game): Promise<void> {
        return Promise.resolve();
    }
    public action(player: Player, _game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Need energy production");
        }
        player.energyProduction--;
        player.terraformRating++;
        return Promise.resolve();
    }
}

