
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
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.victoryPoints++;
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.tags.indexOf(Tags.SCIENCE) !== -1) {
                return new OrOptions(
                    new SelectCard(this.name, "Select a card to discard to draw a card", player.cardsInHand, (foundCards: Array<IProjectCard>) => {
                        player.cardsInHand.splice(player.cardsInHand.indexOf(foundCards[0]), 1);
                        game.dealer.discard(foundCards[0]);
                        player.cardsInHand.push(game.dealer.dealCard());
                        return undefined;
                    }),
                    new SelectOption(this.name, "Do nothing", () => {
                        return undefined;
                    })
                );
            }
            return undefined;
        });
        return undefined;
    }
}
