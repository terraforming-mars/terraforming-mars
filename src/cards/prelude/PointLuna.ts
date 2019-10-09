
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";

export class PointLuna implements CorporationCard {
    public name: string = "Point Luna";
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public startingMegaCredits: number = 38;
    public text: string = "You start with 1 titanium production and 38 MC. Effect: When you play an Earth tag, including this, draw a card.";
    public description: string = "";

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
	    player.cardsInHand.push(game.dealer.dealCard());
        }
    }

    public play(player: Player) {
        player.titaniumProduction++;
	player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}
