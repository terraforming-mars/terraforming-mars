
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class CloudSeeding implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [];
    public name: string = "Cloud Seeding";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 3 ocean tiles. Decrease your mega credit production 1 step and any heat production 1 step. Increase your plant production 2 steps.";
    public description: string = "Lessens solar influx, but enhances plant growth.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOceansOnBoard() < 3) {
            return Promise.reject("Requires 3 ocean tiles");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectPlayer(this, game.getPlayers()), (options: {[x: string]: string}) => {
                const foundPlayer = game.getPlayer(options.option1);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                if (foundPlayer.heatProduction < 1) {
                    reject("Player must have heat production");
                    return;
                }
                player.megaCreditProduction--;
                foundPlayer.heatProduction--;
                player.plantProduction += 2;
                resolve();
            });
        });
    }
}
