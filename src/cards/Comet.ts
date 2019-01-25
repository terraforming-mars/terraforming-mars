
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Comet implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Comet";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 1 step and place an ocean tile. Remove up to 3 plants from any player.";
    public description: string = "Prepare to be catered!";
    public play(player: Player, game: Game): Promise<void> {
        return game.increaseTemperature(player).then(() => {
            return new Promise<void>((resolve, reject) => {
                player.setWaitingFor({
                    initiator: "card",
                    card: this,
                    type: "SelectASpace"
                }, (spaceId: string) => {
                    try { game.addOceanTile(player, spaceId); }
                    catch (err) { reject(err); return; }
                    player.setWaitingFor(undefined);
                    player.setWaitingFor({
                        initiator: "card",
                        card: this,
                        type: "SelectAPlayer"
                    }, (playerId: string) => {
                        const foundPlayer = game.getPlayerById(playerId);
                        if (foundPlayer === undefined) {
                            reject("Player not found.");
                            return;
                        }
                        player.plants = Math.max(0, player.plants - 3);
                        resolve();
                    });
                });
            });
        });
    }
}
