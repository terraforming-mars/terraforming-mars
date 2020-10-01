import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';

export class AcquiredSpaceAgency extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.ACQUIRED_SPACE_AGENCY;
    public play(player: Player, game: Game) {
        for (let foundCard of game.drawCardsByTag(Tags.SPACE, 2)) {
            player.cardsInHand.push(foundCard);
        }

        const drawnCards = game.getCardsInHandByTag(player, Tags.SPACE).slice(-2);

        game.log("${0} drew ${1} and ${2}", b => b.player(player).card(drawnCards[0]).card(drawnCards[1]));

	    player.titanium += 6;
        return undefined;
    };
}

