import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class AcquiredSpaceAgency extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Acquired Space Agency";
    public play(player: Player, game: Game) {
        for (let foundCard of game.drawCardsByTag(Tags.SPACE, 2)) {
            player.cardsInHand.push(foundCard);
        }
	    player.titanium += 6;
        return undefined;
    };
}

