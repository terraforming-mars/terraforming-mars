
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class NitrophilicMoss implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Nitrophilic Moss";
    public text: string = "Requires 3 ocean tiles and that you lose 2 plants. Increase your plant production 2 steps.";
    public description: string = "Specially made to thrive on the salty Martian rock.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.getOceansOnBoard() < 3) {
                reject("Requires 3 ocean tiles");
                return;
            }
            if (player.plants < 2) {
                reject("Must have 2 plants");
                return;
            }
            player.plants -= 2;
            player.plantProduction += 2;
            resolve();
        });
    }
}
