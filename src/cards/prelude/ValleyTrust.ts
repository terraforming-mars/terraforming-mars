
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { SelectCard } from "../../inputs/SelectCard";
import { CardName } from '../../CardName';

export class ValleyTrust implements CorporationCard {
    public name: CardName = CardName.VALLEY_TRUST;
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 37;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        return card.tags.filter(tag => tag === Tags.SCIENCE).length * 2;
    }

    public initialAction(player: Player, game: Game) {
        if (game.getPreludeExtension()) {
            const cardsDrawn: Array<IProjectCard> = [
                game.dealer.dealPreludeCard(),
                game.dealer.dealPreludeCard(),
                game.dealer.dealPreludeCard()
            ];
            return new SelectCard("Choose prelude card to play", cardsDrawn, (foundCards: Array<IProjectCard>) => {
                return player.playCard(game, foundCards[0]);
            }, 1, 1);
        }
        else {
            console.warn("Prelude extension isn't selected.");
            return undefined;
        }
    }

    public play() {
        return undefined;
    }
}
