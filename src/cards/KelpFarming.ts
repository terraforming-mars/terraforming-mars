
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class KelpFarming implements IProjectCard {
    public cost: number = 17;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Kelp Farming";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.megaCreditProduction += 2;
        player.plantProduction += 3;
        player.plants += 2;
        player.victoryPoints++;
        return undefined;
    }
}
