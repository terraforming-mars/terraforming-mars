
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
    public requirements: undefined;
    public description: string = "The moon is a perfect springboard to the solar system, and the mining company Point Luna has the largest spaceport on Luna, making it a perfect partner for Earth inventors wanting to realize their space projects";

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
			player.cardsInHand.push(game.dealer.dealCard());
        }
    }

    public play(player: Player, game: Game) {
        player.titaniumProduction++;
		player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}
