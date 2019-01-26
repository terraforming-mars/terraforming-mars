
import { AndOptions } from "../inputs/AndOptions";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectSpace } from "../inputs/SelectSpace";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class GiantIceAsteroid implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Giant Ice Asteroid";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.";
    public description: string = "Crash it. The bigger, the better";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new AndOptions(new SelectPlayer(this, game.getPlayers()), new SelectSpace(this, "Select first ocean space"), new SelectSpace(this, "Select second ocean space")), (options: {[x: string]: string}) => {
                const foundPlayer = game.getPlayer(options.option1);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                game.increaseTemperature(player).then(function () {
                    return game.increaseTemperature(player);
                }).then(function () {
                    try { game.addOceanTile(player, options.option2); }
                    catch (err) { reject(err); return; }
                    try { game.addOceanTile(player, options.option3); }
                    catch (err) { reject(err); return; }
                    foundPlayer.plants = Math.max(0, foundPlayer.plants - 6);
                    resolve();
                });
            });
        });
    }
}
