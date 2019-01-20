
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class LakeMarineris implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [];
    public name: string = "Lake Marineris";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 0C or warmer. Place 2 ocean tiles. Gain 2 victory points.";
    public description: string = "Filling the Valles Marineris takes a lot of water";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < 0) {
            return Promise.reject("Requires 0C or warmer");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId1: string) => {
                try { game.addOceanTile(player, spaceId1); }
                catch (err) { reject(err); return; }
                player.setWaitingFor(undefined);
                player.setWaitingFor({
                    initiator: "card",
                    card: this,
                    type: "SelectASpace"
                }, (spaceId2: string) => {
                    try { game.addOceanTile(player, spaceId2); }
                    catch (err) { reject(err); return; }
                    player.victoryPoints += 2;
                    resolve();
                });
            });
        });
    }
}
