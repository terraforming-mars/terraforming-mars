
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
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
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new OrOptions(
                new SelectHowToPay(this.name, "How to pay for card", false, false, true, (htp) => {
                    if (htp.heat + htp.megaCredits < 3) {
                        game.dealer.discard(dealtCard);
                        throw "Not enough spent to buy card";
                    }
                    player.megaCredits -= htp.megaCredits;
                    player.heat -= htp.heat;
                    player.cardsInHand.push(dealtCard);
                    return undefined;
                }),
                new SelectOption(this.name, "Discard", () => {
                    game.dealer.discard(dealtCard);
                    return undefined;
                })
            );
        }
        return new OrOptions(
            new SelectOption(this.name, "Buy card", () => {
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
