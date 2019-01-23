
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class GHGProducingBacteria implements IActiveProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "GHG Producing Bacteria";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add 1 microbe to this card, or remove 2 microbes to raise temperature 1 step.";
    public microbes: number = 0;
    public text: string = "Requires 4% oxygen";
    public description: string = "Working for the biosphere and the atmosphere at the same time.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 4) {
            return Promise.reject("Requires 4% oxygen");
        }
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (this.microbes > 1) {
            return new Promise((resolve, reject) => {
                player.setWaitingFor(new OrOptions(new SelectOption(this, "Add 1 microbe"), new SelectOption(this, "Remove 2 microbes to raise temperature 1 step")), (options: {[x: string]: string}) => {
                    if (options.option1 === "1") {
                        this.microbes++;
                        resolve();
                        return;
                    }
                    if (options.option2 === "1") {
                        game.increaseTemperature(player).then(() => {
                            this.microbes -= 2;
                            resolve();
                        }).catch((err: string) => {
                            reject(err);
                        });
                        return;
                    }
                    reject("Unknown option");
                });
            });
        } else {
            this.microbes++;
            return Promise.resolve();
        }
    }
}
