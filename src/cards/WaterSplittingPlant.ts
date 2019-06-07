
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";

export class WaterSplittingPlant implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Water Splitting Plant";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Requires 2 ocean tiles";
    public description: string = "Electrolysis of water yields oxygen and hydrogen, both very useful gases.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 2 - player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public actionText: string = "Spend 3 energy to increase oxygen level by 1";
    public action(player: Player, game: Game) {
        if (player.energy < 3) {
            throw "Need 3 energy";
        }
        player.energy -= 3;
        return game.increaseOxygenLevel(player, 1);
    }
}
