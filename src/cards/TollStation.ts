
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
    public description: string = "Licensed by the 'government'";
    public play(player: Player, game: Game): Promise<void> {
        let opponentsSpaceTags: number = 0;
        game.getPlayers()
            .filter((aPlayer) => aPlayer !== player)
            .forEach((opponent) => {
                opponentsSpaceTags += opponent.getTagCount(Tags.SPACE);
            });
        player.megaCreditProduction += opponentsSpaceTags;
        return Promise.resolve();
    }
}
