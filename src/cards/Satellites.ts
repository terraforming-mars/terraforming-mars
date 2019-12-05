
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Satellites implements IProjectCard {
    public cost: number = 10;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Satellites";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += 1 + player.getTagCount(Tags.SPACE);
        return undefined;
    }
}
