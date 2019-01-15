
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game"; 

export class WavePower implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public cost: number = 8;
    public name: string = "Wave Power";
    public text: string = "Requires 3 ocean tiles. Increase your energy production 1 step.";
    public description: string = "Well, see, first you need some waves...";
    public cardType: CardType = CardType.AUTOMATED;
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.getOceansOnBoard() < 3) {
                reject("Requires 3 ocean tiles");
                return;
            }
            player.energyProduction++;
            player.victoryPoints++;
            resolve();
        });
    }
}

