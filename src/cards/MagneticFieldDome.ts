
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Player } from "../Player";
import { CardType } from "./CardType";
import { Resources } from '../Resources';

export class MagneticFieldDome implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Magnetic Field Dome";
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 2;
    }
    public play(player: Player, _game: Game) {
        if (player.getProduction(Resources.ENERGY) < 2) {
            throw "Need 2 energy production to decrease";
        }
        player.setProduction(Resources.ENERGY,-2);
        player.setProduction(Resources.PLANTS);
        player.terraformRating++;
        return undefined;
    }
}
