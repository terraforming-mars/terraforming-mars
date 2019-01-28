
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class Asteroid implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Asteroid";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 1 step and gain 2 titanium. Remove up to 3 plants from any player";
    public description: string = "What are those plants doing in our impact zone?";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectPlayer(this, game.getPlayers(), "Select player to decrease", (foundPlayer: Player) => {
                game.increaseTemperature(player).then(function () {
                    foundPlayer.plants = Math.max(0, foundPlayer.plants - 3);
                    player.titanium += 2;
                    resolve();
                }).catch((err: string) => {
                    reject(err);
                });
            }));
        });
    }
}
