import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";

export class AcquiredSpaceAgency extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Acquired Space Agency";
    public text: string = "Gain 6 titanium. Reveal cards until you reveal two cards with Space Tags. Take them into your hand, discard the rest.";
    public description: string = "The Western Alliance Space Agency has a lot of leverage, at your disposal";
    public play(player: Player, game: Game) {
	        for (let foundCard of game.drawCardsByTag(Tags.SPACE,2)) {
                    player.cardsInHand.push(foundCard);
                }
	    player.titanium += 6;
            return undefined;
        };
}

