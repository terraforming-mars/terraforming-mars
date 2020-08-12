import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class UtopiaInvest implements IActionCard, CorporationCard {
    public name: CardName = CardName.UTOPIA_INVEST;
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 40;
    public play(player: Player) {
        player.setProduction(Resources.STEEL);
        player.setProduction(Resources.TITANIUM);
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS)  
                + player.getProduction(Resources.STEEL)
                + player.getProduction(Resources.TITANIUM)
                + player.getProduction(Resources.PLANTS)
                + player.getProduction(Resources.ENERGY)
                + player.getProduction(Resources.HEAT) > -5;
    }
    public action(player: Player) {
        let result = new OrOptions();
        result.title = "Select production to decrease one step and gain 4 resources of it";

        let options: Array<SelectOption> = [];

        const reduceMegacredits = new SelectOption("Decrease MC production", "Decrease -MC", () => {
            player.setProduction(Resources.MEGACREDITS, -1);
            player.megaCredits += 4;
            return undefined;
        });

        const reduceSteel = new SelectOption("Decrease steel production", "Decrease steel", () => {
            player.setProduction(Resources.STEEL, -1);
            player.steel += 4;
            return undefined;
        });

        const reduceTitanium = new SelectOption("Decrease titanium production", "Decrease titanium", () => {
            player.setProduction(Resources.TITANIUM, -1);
            player.titanium += 4;
            return undefined;
        });

        const reducePlants = new SelectOption("Decrease plants production", "Decrease plants", () => {
            player.setProduction(Resources.PLANTS, -1);
            player.plants += 4;
            return undefined;
        });

        const reduceEnergy = new SelectOption("Decrease energy production", "Decrease energy", () => {
            player.setProduction(Resources.ENERGY, -1);
            player.energy += 4;
            return undefined;
        });

        const reduceHeat = new SelectOption("Decrease heat production", "Decrease heat", () => {
            player.setProduction(Resources.HEAT, -1);
            player.heat += 4;
            return undefined;
        });

        if (player.getProduction(Resources.MEGACREDITS) > -5) {
            options.push(reduceMegacredits);
        }
        if (player.getProduction(Resources.STEEL) > 0) {
            options.push(reduceSteel);
        }
        if (player.getProduction(Resources.TITANIUM) > 0) {
            options.push(reduceTitanium);
        }
        if (player.getProduction(Resources.PLANTS) > 0) {
            options.push(reducePlants);
        }
        if (player.getProduction(Resources.ENERGY) > 0) {
            options.push(reduceEnergy);
        }
        if (player.getProduction(Resources.HEAT) > 0) {
            options.push(reduceHeat);
        }

        result.options = options;
        return result;
    }
}
