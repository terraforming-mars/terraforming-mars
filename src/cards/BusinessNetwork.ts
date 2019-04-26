
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectCard } from "../inputs/SelectCard";
import { SelectOption } from "../inputs/SelectOption";
import { IProjectCard } from "./IProjectCard";

export class BusinessNetwork implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Business Network";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Look at the top card and either buy it or discard it.";
    public text: string = "Decrease your mega credit production 1 step.";
    public description: string = "Investing in social events can open up new opportunities.";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -4;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction--;
        return undefined;
    }
    public action(player: Player, game: Game) {
        const dealtCard = game.dealer.dealCard();
        return new OrOptions(
            new SelectCard(this.name, "Buy card", [dealtCard], (_foundCards: Array<IProjectCard>) => {
                if (player.megaCredits < 3) {
                    game.dealer.discard(dealtCard);
                    throw "Not enough mega credits to buy card";
                }
                player.megaCredits -= 3;
                player.cardsInHand.push(dealtCard);
                return undefined;
            }),
            new SelectOption(this.name, "Discard", () => {
                game.dealer.discard(dealtCard);
                return undefined;
            })
        );
    }
}
