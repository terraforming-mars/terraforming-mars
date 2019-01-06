
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";

export class InventionContest implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 2;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Invention Contest";
    public text: string = "LOOK AT THE TOP 3 CARDS FROM THE DECK. TAKE 1 OF THEM INTO HAND AND DISCARD THE OTHER 2";
    public description: string = "Engaging the scientific community in a field of your choice";
    public play(player: Player, game: Game): void {
        player.cardsDealt = game.dealer.getCards(3);
        player.waitingFor = "Select a card";
        player.onCardSelected = function (card: IProjectCard) {
            player.cardsDealt = [];
            player.cardsInHand.push(card);
            player.waitingFor = undefined;
            player.onCardSelected = undefined;
        }
    }
}
