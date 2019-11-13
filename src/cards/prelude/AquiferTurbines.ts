import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { ISpace } from "../../ISpace";
import { SelectSpace } from "../../inputs/SelectSpace";

export class AquiferTurbines extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
	public cost: number = 3;
    public name: string = "Aquifer Turbines";
    public text: string = "Place an ocean tile and and increase energy production 2 steps. Pay 3 MC.";
    public requirements: undefined;
    public description: string = "The high pressure of an underground aquifer can be used for energy production when the water is released";
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for ocean", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            player.energyProduction +=2 ;
            return undefined;
        });

    }
}

