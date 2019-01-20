
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class BusinessContacts implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Business Contacts";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Look at the top 4 cards from the deck. Take 2 of them into hand and discard the other 2.";
    public description: string = "Money and information are often interchangeable.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const availableCards: Array<IProjectCard> = game.dealer.getCards(4);
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectACardForFree",
                cardsToPick: 2,
                cards: availableCards
            }, (card1: string, card2: string) => {
                const foundCard1 = availableCards.filter((card) => card.name === card1)[0];
                const foundCard2 = availableCards.filter((card) => card.name === card2)[0];
                if (foundCard1 === undefined) {
                    reject("Card 1 not found");
                    return;
                }
                if (foundCard2 === undefined) {
                    reject("Card 2 not found");
                    return;
                }
                player.cardsInHand.push(foundCard1);
                player.cardsInHand.push(foundCard2);
                resolve();
            });
        });
    }
}
