import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class WaterToVenus implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Water To Venus";
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }

}