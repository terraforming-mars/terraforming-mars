
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game"; 

export class WavePower implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public cost: number = 8;
    public nonNegativeVPIcon: boolean = true;
    public name: string = "Wave Power";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.energyProduction++;
        player.victoryPoints++;
        return undefined;
    }
}

