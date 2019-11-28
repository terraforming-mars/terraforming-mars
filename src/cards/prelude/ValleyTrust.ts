
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
    public text: string = "You start with 37 MC. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two. Effect: When you play an Science tag, you pay 2MC less for it.";
    public requirements: undefined;
    public description: string = "A community of technological entrepreneurs join forces to invest in space exploration";

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
