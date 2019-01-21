
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectCard } from "../inputs/SelectCard";
import { DoNothing } from "../inputs/DoNothing";

export class MarsUniversity implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public name: string = "Mars University";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "When you play a science tag, including this, you may discard a card from hand to draw a card. Gain 1 victory point.";
    public description: string = "A major step towards understanding Mars.";
    public play(player: Player, game: Game): Promise<void> {
        player.victoryPoints++;
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.tags.indexOf(Tags.SCIENCE) !== -1) {
                return new Promise((resolve, reject) => {
                    player.setWaitingFor(new OrOptions(new SelectCard(this, "Select a card to discard", player.cardsInHand), new DoNothing(this)), (options: {[x: string]: string}) => {
                        if (options.option2 === "1") {
                            resolve();
                            return;
                        }
                        let foundCard: IProjectCard | undefined;
                        let foundCardIndex: number = 0;
                        for (; foundCardIndex < player.cardsInHand.length; foundCardIndex++) {
                            if (player.cardsInHand[foundCardIndex].name === options.option1) {
                                foundCard = player.cardsInHand[foundCardIndex];
                                break;
                            }
                        }
                        if (foundCard === undefined) {
                            reject("Card not found");
                            return;
                        }
                        player.cardsInHand.splice(foundCardIndex, 1);
                        player.cardsInHand.push(game.dealer.getCards(1)[0]);
                        resolve();
                    });
                });
            }
        });
        return Promise.resolve();
    }
}
