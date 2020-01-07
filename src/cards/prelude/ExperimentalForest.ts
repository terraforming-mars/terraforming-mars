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
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
	        for (let foundCard of game.drawCardsByTag(Tags.PLANT, 2)) {
                player.cardsInHand.push(foundCard);
            }
            return game.addGreenery(player, space.id);
        });
    }
}

