
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { Resources } from '../../Resources';

export class PointLuna implements CorporationCard {
    public name: string = "Point Luna";
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public startingMegaCredits: number = 38;
    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.tags.indexOf(Tags.EARTH) !== -1) {
			player.cardsInHand.push(game.dealer.dealCard());
        }
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.TITANIUM);
		player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
}
