
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class GHGProducingBacteria implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "GHG Producing Bacteria";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add 1 microbe to this card, or remove 2 microbes to raise temperature 1 step.";
    public microbes: number = 0;
    public text: string = "Requires 4% oxygen";
    public description: string = "Working for the biosphere and the atmosphere at the same time.";
    public play(_player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 4) {
            return Promise.reject("Requires 4% oxygen");
        }
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        if (this.microbes > 1) {
            return new Promise((resolve, reject) => {
                player.setWaitingFor(
                    new OrOptions(
                        new SelectOption(this.name, "Add 1 microbe", () => {
                            this.microbes++;
                            resolve();
                        }),
                        new SelectOption(this.name, "Remove 2 microbes to raise temperature 1 step", () => {
                            game.increaseTemperature(player).then(() => {
                                this.microbes -= 2;
                                resolve();
                            }).catch((err: string) => {
                                reject(err);
                            });
                        })
                    )
                );
            });
        } else {
            this.microbes++;
            return Promise.resolve();
        }
    }
}
