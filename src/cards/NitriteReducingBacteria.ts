
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class NitriteReducingBacteria implements IActiveProjectCard {
    public cost: number = 11;
    public microbes: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Nitrite Reducing Bacteria";
    public text: string = "Add 3 microbes to this card.";
    public actionText: string = "Add 1 microbe to this card, or remove 3 microbes to increase your terraform rating 1 step.";
    public description: string = "Making use of the nitrites in the ground to release nitrogen into the atmosphere.";
    public play(_player: Player, _game: Game): Promise<void> {
        this.microbes += 3;
        return Promise.resolve();
    }
    public action(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(
                new OrOptions(
                    new SelectOption(this, "Add 1 microbe to this card", () => {
                        this.microbes++;
                        resolve();
                    }),
                    new SelectOption(this, "Remove 3 microbes to increase your terraform rating 1 step", () => {
                        if (this.microbes < 3) {
                            reject("Need 3 microbes to remove");
                        } else {
                            this.microbes -= 3;
                            player.terraformRating++;
                            resolve();
                        }
                    })
                )
            );
        });
    }
}
