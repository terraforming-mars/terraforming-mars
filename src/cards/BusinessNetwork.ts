
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectCard } from "../inputs/SelectCard";
import { SelectOption } from "../inputs/SelectOption";

export class BusinessNetwork implements IActiveProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Business Network";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Look at the top card and either buy it or discard it.";
    public text: string = "Decrease your mega credit production 1 step.";
    public description: string = "Investing in social events can open up new opportunities.";
    public play(player: Player, _game: Game): Promise<void> {
        player.megaCreditProduction--;
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const dealtCard = game.dealer.getCards(1)[0];
            player.setWaitingFor(new OrOptions(new SelectCard(this, "Buy card", [dealtCard]), new SelectOption(this, "Discard")), (options: {[x: string]: string}) => {
                if (options.option2 === "1") {
                    game.dealer.discard(dealtCard);
                    resolve();
                    return;
                } else {
                    if (player.megaCredits < 3) {
                        game.dealer.discard(dealtCard);
                        reject("Not enough mega credits to buy card");
                        return;
                    }
                    player.megaCredits -= 3;
                    player.cardsInHand.push(dealtCard);
                    resolve();
                }
            });
        });
    }
}
