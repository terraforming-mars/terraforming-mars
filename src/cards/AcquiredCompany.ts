
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AcquiredCompany implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Acquired Company";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 3 steps";
    public description: string = "This interplanetary company will surely pay off";
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += 3;
        return undefined;
    }
}
