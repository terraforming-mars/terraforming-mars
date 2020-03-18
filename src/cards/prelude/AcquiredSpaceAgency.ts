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
	    player.titanium += 6;
        return undefined;
    };
}

