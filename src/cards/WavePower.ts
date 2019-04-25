
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game"; 
import { PlayerInput } from "../PlayerInput";

export class WavePower implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public cost: number = 8;
    public name: string = "Wave Power";
    public text: string = "Requires 3 ocean tiles. Increase your energy production 1 step. Gain 1 victory point.";
    public description: string = "Well, see, first you need some waves...";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(_player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 3;
    }
    public play(player: Player, game: Game): PlayerInput | undefined {
        if (game.getOceansOnBoard() < 3) {
            throw "Requires 3 ocean tiles";
        }
        player.energyProduction++;
        player.victoryPoints++;
        return undefined;
    }
}

