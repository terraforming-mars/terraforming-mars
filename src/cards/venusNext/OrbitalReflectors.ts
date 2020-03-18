
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class OrbitalReflectors  implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.VENUS, Tags.SPACE];
    public name: CardName = CardName.ORBITAL_REFLECTORS;
    public cardType: CardType = CardType.AUTOMATED;



    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,2);
        player.setProduction(Resources.HEAT, 2);
        return undefined;
    }
}