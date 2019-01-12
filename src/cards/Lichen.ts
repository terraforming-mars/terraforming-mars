
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";

export class Lichen implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Lichen";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires -24C or wamer. Increase your plant production 1 step";
    public description: string = "Slow growing, but very resilient";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.temperature < -24) {
                reject("Requires -24C or warmer");
                return;
            }
            player.plantProduction++;
            resolve();
        });
    }
}

