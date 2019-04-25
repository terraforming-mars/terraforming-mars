
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Sponsors implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Sponsors";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 2 steps";
    public description: string = "Willing to support your projects";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += 2;
        return undefined;
    }
}
