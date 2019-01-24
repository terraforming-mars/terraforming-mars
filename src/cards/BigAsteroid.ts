
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class BigAsteroid implements IProjectCard {
    public cost: number = 27;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Big Asteroid";
    public text: string = "Raise temperature 2 steps and gain 4 titanium. Remove up to 4 plants from any player.";
    public description: string = "There are many unpopulated areas to crash it on";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectPlayer(this), (playerId: string) => {
                const foundPlayer = game.getPlayerById(playerId);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                } else {
                    game.increaseTemperature(player)
                        .then(function () { return game.increaseTemperature(player); })
                        .then(function () {
                            player.titanium += 4;
                            foundPlayer.plants = Math.max(foundPlayer.plants - 4, 0);
                            resolve();
                        })
                        .catch((err: string) => {
                            reject(err);
                        });
                }
            });
        });
    }
}
