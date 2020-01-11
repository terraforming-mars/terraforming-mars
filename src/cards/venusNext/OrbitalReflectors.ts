
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { Resources } from '../../Resources';

export class OrbitalReflectors  implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.VENUS, Tags.SPACE];
    public name: string = "Orbital Reflectors";
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(): boolean {
        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,2);
        player.setProduction(Resources.HEAT, 2);
        return undefined;
    }
}