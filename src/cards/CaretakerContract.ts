
import { IActiveProjectCard } from "./IActiveProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";

export class CaretakerContract implements IActiveProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Caretaker Contract";
    public text: string = "Requires 0C or warmer";
    public actionText: string = "Spend 8 heat to increase your terraform rating 1 step";
    public description: string = "In charge of establishing comfortable temperatures";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < 0) {
            return Promise.reject("Requires 0C or warmer");
        }
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.heat < 8) {
                reject("Need 8 heat to spend");
                return;
            }
            player.heat -= 8;
            player.terraformRating++;
            resolve();
        });
    }
}
