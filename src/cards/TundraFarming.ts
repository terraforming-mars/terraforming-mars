
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TundraFarming implements IProjectCard {
    public cost: number = 16;
    public nonNegativeVPIcon: boolean = true;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Tundra Farming";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -6 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.plantProduction++;
        player.megaCreditProduction += 2;
        player.plants++;
        player.victoryPoints += 2;
        return undefined;
    }
} 
