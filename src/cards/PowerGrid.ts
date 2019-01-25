
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class PowerGrid implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Power Grid";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your energy production 1 step for each power tag you have, including this";
    public description: string = "Making efficient use of your energy production";
    public play(player: Player, _game: Game): Promise<void> {
        player.energyProduction += 1 + player.getTagCount(Tags.ENERGY);
        return Promise.resolve();
    }
}
