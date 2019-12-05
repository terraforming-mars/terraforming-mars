
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
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 2;
    }
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
