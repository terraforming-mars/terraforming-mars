
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";

export class Vitor implements CorporationCard {
    public name: string = "Vitor";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 45;
    public text: string = "You start with 45 MC. As your first action, fund an award for free. Effect: When you play a card with a NON-NEGATIVE VP icon, including this, gain 3MC";
    public description: string = "";

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
	    player.megaCredits +=3;
        }
    }

    public play(player: Player) {
        player.megaCredits +=3;
        return undefined;
    }
}
