
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class DeimosDown implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Deimos Down";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 3 steps and gain 4 steel. Remove up to 8 plants from any player.";
    public description: string = "We don't use that moon anyway";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectPlayer(this, game.getPlayers()), (options: {[x: string]: string}) => {
                const foundPlayer = game.getPlayer(options.option1);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                game.increaseTemperature(player)
                    .then(function () { return game.increaseTemperature(player); })
                    .then(function () { return game.increaseTemperature(player); })
                    .then(function () {
                        player.steel += 4;
                        foundPlayer.plants = Math.max(0, foundPlayer.plants - 8);
                        resolve();
                    })
                    .catch((err: string) => {
                        reject(err);
                    });
            });
        });
    }
}
