
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class GreatDam implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Great Dam";
    public text: string = "Requires 4 ocean tiles. Increase your energy production 2 steps. Gain 1 victory point.";
    public description: string = "Letting natural processes do the work";
    public play(player: Player, game: Game) {
        if (game.getOceansOnBoard() < 4) {
            throw "Requires 4 ocean tiles";
        }
        player.victoryPoints++;
        player.energyProduction += 2;
        return undefined;
    }
}

