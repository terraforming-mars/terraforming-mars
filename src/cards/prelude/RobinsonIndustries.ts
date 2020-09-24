import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { LogHelper } from "../../components/LogHelper";
import { Game } from "../../Game";

export class RobinsonIndustries implements IActionCard, CorporationCard {
    public name: CardName = CardName.ROBINSON_INDUSTRIES;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 47;
    public play() {
        return undefined;
    }

    public canAct(player: Player): boolean {
        return player.canAfford(4); 
    }

    public action(player: Player, game: Game) {
        let minimum = player.getProduction(Resources.MEGACREDITS);
        let lowest: Array<SelectOption> = [];

        [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT].forEach((resource) => {
            const option = new SelectOption("Increase " + resource +  " production 1 step", "Select", () => {
                this.increaseAndLogProduction(game, player, resource);
                return undefined;
            });
            
            if (player.getProduction(resource) < minimum) {
                lowest = [];
                minimum = player.getProduction(resource);
            }

            if (player.getProduction(resource) === minimum) lowest.push(option);
        });

        const result = new OrOptions();
        result.options = lowest;
        return result;
    }

    private increaseAndLogProduction(game: Game, player: Player, resource: Resources) {
        player.setProduction(resource);
        player.megaCredits -= 4;
        LogHelper.logGainProduction(game, player, resource);
    }
}
