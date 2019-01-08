
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
    public play(player: Player, game: Game): Promise<void> {
        return new Promise<void>((resolve: Function, reject: Function) => {
            const cardsDrawn: Array<IProjectCard> = game.dealer.getCards(3);
            player.waitingForInput.push({
                initiator: "card",
                cardName: "InventionContest",
                type: "SelectACardForFree",
                cards: cardsDrawn
            });
            const onInputHandler = function (actionName: string, input: string): void {
                if (actionName === "SelectACardForFree") {
                    const selectedCard = cardsDrawn.filter((card) => card.name === input);
                    if (selectedCard.length === 0) {
                        reject("Selected card wasn't one dealt");
                        return;
                    }
                    player.cardsInHand.push(selectedCard[0]);
                    player.removeInputEvent(onInputHandler);
                    resolve();
                }
            }
            player.addInputEvent(onInputHandler);
        });
    }
}
