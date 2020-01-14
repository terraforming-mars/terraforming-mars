import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class SpinInducingAsteroid implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Spin-Inducing Asteroid";
    public cardType: CardType = CardType.EVENT;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() - (2 * player.getRequirementsBonus(game)) <= 10;
    }
    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,2);
        return undefined;
    }

}