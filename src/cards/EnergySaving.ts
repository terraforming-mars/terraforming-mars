
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";

export class EnergySaving implements IProjectCard {
    public cardType: CardType = CardType.AUTOMATED;
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Energy Saving";
    public text: string = "Increase your energy production 1 step for each city tile in play.";
    public requirements: undefined;
    public description: string = "Minimizing urban energy spending";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.energyProduction += game.getCitiesInPlay();
        return undefined;
    }
}
