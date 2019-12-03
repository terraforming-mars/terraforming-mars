
import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class RobinsonIndustries implements IActionCard, CorporationCard {
    public name: string = "Robinson Industries";
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 47;
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(4); 
    }
    public action(player: Player) {
        let minimum = player.megaCreditProduction;
        let lowest: Array<SelectOption> = [new SelectOption("Increase MC production 1 step", () => {
            player.megaCreditProduction++;
            player.megaCredits -= 4;
            return undefined;
        })];
        if (player.steelProduction < minimum) {
            lowest = [];
            minimum = player.steelProduction;
        }
        if (player.steelProduction === minimum) {
            lowest.push(new SelectOption("Increase steel production 1 step", () => {
                player.steelProduction++;
                player.megaCredits -= 4;
                return undefined;
            }));
        }
        if (player.titaniumProduction < minimum) {
            lowest = [];
            minimum = player.titaniumProduction;
        }
        if (player.titaniumProduction === minimum) {
            lowest.push(new SelectOption("Increase titanium production 1 step", () => {
                player.titaniumProduction++;
                player.megaCredits -= 4;
                return undefined;
            }));
        }
        if (player.plantProduction < minimum) {
            lowest = [];
            minimum = player.plantProduction;
        }
        if (player.plantProduction === minimum) {
            lowest.push(new SelectOption("Increase plant production 1 step", () => {
                player.plantProduction++;
                player.megaCredits -= 4;
                return undefined;
            }));
        }
        if (player.energyProduction < minimum) {
            lowest = [];
            minimum = player.energyProduction;
        }
        if (player.energyProduction === minimum) {
            lowest.push(new SelectOption("Increase energy production 1 step", () => {
                player.energyProduction++;
                player.megaCredits -= 4;
                return undefined;
            }));
        }
        if (player.heatProduction < minimum) {
            lowest = [];
            minimum = player.heatProduction;
        }
        if (player.heatProduction === minimum) {
            lowest.push(new SelectOption("Increase heat production 1 step", () => {
                player.heatProduction++;
                player.megaCredits -= 4;
                return undefined;
            }));
        }
        const result = new OrOptions();
        result.options = lowest;
        return result;
    }
}
