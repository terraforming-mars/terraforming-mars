import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { ISpace } from "../../ISpace";
import { SelectSpace } from "../../inputs/SelectSpace";


export class PolarIndustries extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Polar Industries";
    public text: string = "Place an ocean tile and and increase heat production 2 steps";
    public description: string = "The poles of Mars have an abundance of both water and carbon dioxide ready to be taken";
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for ocean", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            player.heatProduction +=2 ;
            return undefined;
        });

    }
}

