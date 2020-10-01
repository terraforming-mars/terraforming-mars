import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from "../../ISpace";
import { CardName } from '../../CardName';

export class ExperimentalForest extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.PLANT];
    public name: CardName = CardName.EXPERIMENTAL_FOREST
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
	        for (let foundCard of game.drawCardsByTag(Tags.PLANT, 2)) {
                player.cardsInHand.push(foundCard);
            }

            const drawnCards = game.getCardsInHandByTag(player, Tags.PLANT).slice(-2);

            game.log("${0} drew ${1} and ${2}", b => b.player(player).card(drawnCards[0]).card(drawnCards[1]));

            return game.addGreenery(player, space.id);
        });
    }
}

