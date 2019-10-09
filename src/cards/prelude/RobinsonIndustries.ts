
import { IActionCard } from "../ICard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./../corporation/CorporationCard";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";


export class RobinsonIndustries implements IActionCard, CorporationCard {
    public name: string = "Robinson Industries";
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 47;
    public actionText: string = "Spend 4 MC to increase one of your LOWEST PRODUCTION 1 step.";
    public text: string = "";
    public description: string = "";
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(4); 
    }
    public action(player: Player, _game: Game) {
	let minProduction = Math.min(player.megaCreditProduction, player.steelProduction, player.titaniumProduction, player.plantProduction, player.energyProduction, player.heatProduction);    
        return new OrOptions(
            new SelectOption("Increase MC production 1 step", () => {
	        if (player.megaCreditProduction = minProduction) {
	    	     player.megaCreditProduction++;
	             player.megaCredits -= 4;
		}
                return undefined;
	    }),
            new SelectOption("Increase steel production 1 step", () => {
	        if (player.steelProduction = minProduction) {
	             player.steelProduction++;
	             player.megaCredits -= 4;
		}
                return undefined;
	    }),
            new SelectOption("Increase titanium production 1 step", () => {
                if (player.titaniumProduction = minProduction) {
                     player.titaniumProduction++;
                     player.megaCredits -= 4;
                }
                return undefined;
            }),
            new SelectOption("Increase plant production 1 step", () => {
                if (player.plantProduction = minProduction) {
                     player.plantProduction++;
                     player.megaCredits -= 4;
                }
                return undefined;
            }),
            new SelectOption("Increase energy production 1 step", () => {
                if (player.energyProduction = minProduction) {
                     player.energyProduction++;
                     player.megaCredits -= 4;
                }
                return undefined;
            }),
            new SelectOption("Increase heat production 1 step", () => {
                if (player.heatProduction = minProduction) {
                     player.heatProduction++;
                     player.megaCredits -= 4;
                }
                return undefined;
            })	    
	    );
	    
    }
}
