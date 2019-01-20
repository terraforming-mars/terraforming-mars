
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class IceAsteroid implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Ice Asteroid";
    public text: string = "Place 2 ocean tiles";
    public description: string = "We need its water down here";
    public play(player: Player, game: Game): Promise<void> {
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
                    resolve();
                });
            });
        });
    }
}
