import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from "../../ISpace";

export class ExperimentalForest extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Experimental Forest";
    public text: string = "Place 1 Greenery Tile. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.";
    public requirements: undefined;
    public description: string = "Nothing puts new ecology balance like having a biological testing ground";
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", game.getAvailableSpacesForGreenery(player), (space: ISpace) => {
	        for (let foundCard of game.drawCardsByTag(Tags.PLANT,2)) {
                    player.cardsInHand.push(foundCard);
                }
            return game.addGreenery(player, space.id);
        });
    }
}

