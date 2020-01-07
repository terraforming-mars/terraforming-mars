import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";


export class GiantSolarShade implements IProjectCard {
    public cost: number = 27;
    public tags: Array<Tags> = [Tags.SPACE, Tags.VENUS];
    public name: string = "Giant Solar Shade";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        return game.increaseVenusScaleLevel(player, 3);
    }
}