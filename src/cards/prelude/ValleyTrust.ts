
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { SelectCard } from "../../inputs/SelectCard";

export class ValleyTrust implements CorporationCard {
    public name: string = "Valley Trust";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 37;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.SCIENCE) !== -1) {
            return 2;
        }
        return 0;
    }

    public initialAction(player: Player, game: Game) {
        const cardsDrawn: Array<IProjectCard> = [
            game.dealer.dealPreludeCard(),
            game.dealer.dealPreludeCard(),
            game.dealer.dealPreludeCard()
        ];
        return new SelectCard("Choose prelude card to play", cardsDrawn, (foundCards: Array<IProjectCard>) => {
            return player.playCard(game, foundCards[0]);
        }, 1, 1);
    }

    public play() {
        return undefined;
    }
}
