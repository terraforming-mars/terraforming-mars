
import { Game } from "../Game";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Resources } from '../Resources';

export class MagneticFieldGenerators implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Magnetic Field Generators";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 4;
    }
    public play(player: Player, _game: Game) {
        if (player.getProduction(Resources.ENERGY) < 4) {
            throw "Must have 4 energy production";
        }
        player.setProduction(Resources.ENERGY,-4);
        player.plantProduction += 2;
        player.terraformRating += 3;
        return undefined;
    }
} 
