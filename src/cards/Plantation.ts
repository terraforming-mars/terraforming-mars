
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";

export class Plantation implements IProjectCard {
    public cost: number = 15;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Plantation";
    public text: string = "Requires 2 science tags. Place a greenery tile and raise oxygen 1 step.";
    public description: string = "By focusing on a limited area, helpful measures can be taken to improve local conditions for plant life";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.getTagCount(Tags.SCIENCE) < 2) {
                reject("Requires 2 science tags to play");
                return;
            }
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (input: string) => {
                try { game.addGreenery(player, input); }
                catch (err) { reject(err); return; }
                resolve();
            });
        });
    }
}
