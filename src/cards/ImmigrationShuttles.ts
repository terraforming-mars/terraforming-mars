
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ImmigrationShuttles implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Immigration Shuttles";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 5 steps. Gain 1 victory point for every 3rd city in play";
    public description: string = "The new world attracts ever more immigrants from the old";
    public canPlay(): boolean {
        return true;
    }
    public onGameEnd(player: Player, game: Game) {
        player.victoryPoints += Math.floor(game.getCitiesInPlay() / 3); 
    }
    public play(player: Player) {
        player.megaCreditProduction += 5;
        return undefined;
    }
}
