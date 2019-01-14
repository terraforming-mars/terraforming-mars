
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class NitriteReducingBacteria implements IActiveProjectCard {
    public cost: number = 11;
    public microbes: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Nitrite Reducing Bacteria";
    public text: "Add 3 microbes to this card.";
    public actionText: "Add 1 microbe to this card, or remove 3 microbes to increase your terraform rating 1 step.";
    public description: "Making use of the nitrites in the ground to release nitrogen into the atmosphere.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            this.microbes += 3;
            resolve();
        });
    }
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAmount",
                message: "0 - Add 1 microbe to this card, 1 - Remove 3 microbes to increase your terraform rating 1 step."
            }, (option: string) => {
                if (option === "0") {
                    this.microbes++;
                    resolve();
                } else if (option === "1") {
                    if (this.microbes < 3) {
                        reject("Need 3 microbes to remove");
                    } else {
                        this.microbes -= 3;
                        player.terraformRating++;
                        resolve();
                    }
                } else {
                    reject("Must select option 0 or 1");
                }
            });
        });
    }
}
