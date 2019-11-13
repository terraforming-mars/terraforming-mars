
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TollStation implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Toll Station";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 1 step for each space tag your opponents have.";
    public requirements: undefined;
    public description: string = "Licensed by the 'government'";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.megaCreditProduction += game.getPlayers()
            .filter((aPlayer) => aPlayer !== player)
            .map((opponent) => opponent.getTagCount(Tags.SPACE))
            .reduce((a, c) => a + c, 0);
        return undefined;
    }
}
