
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class InventionContest implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 2;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Invention Contest";
    public text: string = "LOOK AT THE TOP 3 CARDS FROM THE DECK. TAKE 1 OF THEM INTO HAND AND DISCARD THE OTHER 2";
    public description: string = "Engaging the scientific community in a field of your choice";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise<void>((resolve: Function, _reject: Function) => {
            const cardsDrawn: Array<IProjectCard> = game.dealer.getCards(3);
            player.setWaitingFor(new SelectCard(this.name, "Select card to take into hand", cardsDrawn, (foundCards: Array<IProjectCard>) => {
                player.cardsInHand.push(foundCards[0]);
                cardsDrawn.forEach((c) => {
                    if (c.name !== foundCards[0].name) {
                        game.dealer.discard(c);
                    }
                });
                resolve();
            }));
        });
    }
}
