
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
    public text: string = "Increase your mega credit production 1 step for each space tag you have, including this.";
    public description: string = "Coordinating orbital traffic.";
    public play(player: Player, _game: Game): Promise<void> {
        player.megaCreditProduction += 1 + player.getTagCount(Tags.SPACE);
        return Promise.resolve();
    }
}
