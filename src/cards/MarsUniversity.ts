
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectCard } from "../inputs/SelectCard";
import { SelectOption } from "../inputs/SelectOption";

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
                    player.setWaitingFor(
                        new OrOptions(
                            new SelectCard(this.name, "Select a card to discard to draw a card", player.cardsInHand, (foundCards: Array<IProjectCard>) => {
                                let foundCardIndex: number = 0;
                                const foundCard = foundCards[0];
                                for (; foundCardIndex < player.cardsInHand.length; foundCardIndex++) {
                                    if (player.cardsInHand[foundCardIndex].name === foundCard.name) {
                                        break;
                                    }
                                }
                                if (foundCardIndex === player.cardsInHand.length) {
                                    reject("Card not found");
                                    return;
                                }
                                player.cardsInHand.splice(foundCardIndex, 1);
                                player.cardsInHand.push(game.dealer.getCards(1)[0]);
                                resolve();
                            }),
                            new SelectOption(this.name, "Don't do anything", () => { resolve(); })
                        )
                    );
                });
            }
            return undefined;
        });
        return Promise.resolve();
    }
}
