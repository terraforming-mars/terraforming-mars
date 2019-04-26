
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class BusinessContacts implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Business Contacts";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Look at the top 4 cards from the deck. Take 2 of them into hand and discard the other 2.";
    public description: string = "Money and information are often interchangeable.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        const availableCards: Array<IProjectCard> = [];
        for (let i = 0; i < 4; i++) {
            availableCards.push(game.dealer.dealCard());
        }
        return new SelectCard(this.name, "Select cards to keep", availableCards, (foundCards: Array<IProjectCard>) => {
            player.cardsInHand.push(foundCards[0]);
            player.cardsInHand.push(foundCards[1]);
            availableCards.forEach((availableCard) => {
                if (foundCards.find((foundCard) => foundCard.name === availableCard.name) === undefined) {
                    game.dealer.discard(availableCard);
                }
            });
            return undefined;
        }, 2, 2);
    }
}
