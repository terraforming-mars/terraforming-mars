
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class GreatDam implements IProjectCard {
    public cost: number = 12;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Great Dam";
    public text: string = "Requires 4 ocean tiles. Increase your energy production 2 steps. Gain 1 victory point.";
    public description: string = "Letting natural processes do the work";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.victoryPoints++;
        player.energyProduction += 2;
        return undefined;
    }
}

