
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class ElectroCatapult implements IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Electro Catapult";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 1 plant or 1 steel to gain 7 mega credit.";
    public text: string = "Oxygen must be 8% or less. Decrease your energy production 1 step. Gain 1 victory point.";
    public description: string = "A 200km long acceleration ramp up the side of Pavonis Mons, hurtling export goods into space.";
    public action(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(
                new OrOptions(
                    new SelectOption(this.name, "Spend 1 plant", () => {
                        if (player.plants < 1) {
                            reject("Need plant to spend");
                            return;
                        }
                        player.plants--;
                        player.megaCredits += 7;
                        resolve();
                    }),
                    new SelectOption(this.name, "Spend 1 steel", () => {
                        if (player.steel < 1) {
                            reject("Need steel to spend");
                            return;
                        }
                        player.steel--;
                        player.megaCredits += 7;
                        resolve();
                    })
                )
            );
        });
    }
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() > 8) {
            return Promise.reject("Oxygen must be 8% or less.");
        }
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        player.energyProduction--;
        player.victoryPoints++;
        return Promise.resolve();
    }
}
