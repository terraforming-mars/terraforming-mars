
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Cartel implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Cartel";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 1 step for each Earth tag you have, including this.";
    public description: string = "We see it as a brotherhood.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.megaCreditProduction += player.getTagCount(Tags.EARTH) + 1;
            resolve();
        });
    }
}
