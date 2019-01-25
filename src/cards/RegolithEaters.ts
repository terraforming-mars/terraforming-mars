
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class RegolithEaters implements IActiveProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "Regolith Eaters";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public actionText: string = "Add 1 microbe to this card, or remove 2 microbes from this card to raise oxygen level 1 step.";
    public description: string = "Living on the rocks and excreting oxygen.";
    public microbes: number = 0;
    public play(_player: Player, _game: Game): Promise<void> {
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (this.microbes < 2) {
            this.microbes++;
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new OrOptions(new SelectOption(this, "Add 1 microbe to this card"), new SelectOption(this, "Remove 2 microbes to raise oxygen level 1 step")), (options: {[x: string]: string}) => {
                if (options.option1 === "1") {
                    this.microbes++;
                    resolve();
                    return;
                }
                if (options.option2 === "1") {
                    game.increaseOxygenLevel(player).then(() => {
                        this.microbes -= 2;
                        resolve();
                    }).catch((err) => reject(err));
                    return;
                }
                reject("Unknown option");
            });
        });
    }
}
