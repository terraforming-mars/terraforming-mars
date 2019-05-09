
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { SelectOption } from "../inputs/SelectOption";
import { IProjectCard } from "./IProjectCard";

export class InventorsGuild implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Inventors' Guild";
    public cardType: CardType = CardType.ACTIVE;
    public actionText = "Look at the top card and either buy it or discard it";
    public description: string = "When great minds meet, new ideas abount";
    public text: string = "";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public action(player: Player, game: Game) {
        const topCard = game.dealer.dealCard();
        if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new OrOptions(
                new SelectHowToPay(this.name, "Buy card " + topCard.name, false, false, true, (htp) => {
                    if (htp.heat + htp.megaCredits < 3) {
                        game.dealer.discard(topCard);
                        throw "Can not afford to buy card";
                    }
                    player.megaCredits -= htp.megaCredits;
                    player.heat -= htp.heat;
                    player.cardsInHand.push(topCard);
                    return undefined;
                }),
                new SelectOption(this.name, "Discard it", () => {
                    game.dealer.discard(topCard);
                    return undefined;
                })
            );
        }
        return new OrOptions(
            new SelectOption(this.name, "Buy card " + topCard.name, () => {
                if (player.megaCredits < 3) {
                    game.dealer.discard(topCard);
                    throw "Can not afford to buy card";
                }
                player.megaCredits -= 3;
                player.cardsInHand.push(topCard);
                return undefined;
            }),
            new SelectOption(this.name, "Discard it", () => {
                game.dealer.discard(topCard);
                return undefined;
            })
        );
    }
}
