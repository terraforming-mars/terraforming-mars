
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export class LocalHeatTrapping implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: string = "Local Heat Trapping";
    public text: string = "Spend 5 heat to either gain 4 plants, or to add 2 animals to ANOTHER card.";
    public description: string = "Life can benefit from local hot spots";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.heat < 5) {
                reject("Not enough heat");
                return;
            }
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "Gain4PlantsOrAnotherCard"
            }, (input: string) => {
                if (input === this.name) {
                    reject("Animals must be added to ANOTHER card.");
                    return;
                }
                if (input === "0") {
                    player.plants += 4;
                    player.heat -= 5;
                    resolve();
                    return;
                }
                const findCard = game.getCard(this.name);
                if (findCard === undefined) {
                    reject("Could not find card");
                    return;
                }
                try {
                    player.addAnimalsToCard(findCard, 2);
                } catch (err) { reject(err); return; }
                player.heat -= 5;
                resolve();
                return;
            });
        });
    }
}
