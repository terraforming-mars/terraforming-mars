
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { SelectOption } from "../inputs/SelectOption";
import { IProjectCard } from "./IProjectCard";
import { IActionCard } from "./ICard";

export class InventorsGuild implements IActionCard, IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Inventors' Guild";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        const topCard = game.dealer.dealCard();
        if (player.canAfford(3)) {
            if (player.canUseHeatAsMegaCredits && player.heat > 0) {
                return new OrOptions(
                    new SelectHowToPay("Buy card " + topCard.name, false, false, true, false, (htp) => {
                        if (htp.heat + htp.megaCredits < 3) {
                            game.dealer.discard(topCard);
                            throw "Can not afford to buy card";
                        }
                        player.megaCredits -= htp.megaCredits;
                        player.heat -= htp.heat;
                        player.cardsInHand.push(topCard);
                        return undefined;
                    }),
                    new SelectOption("Discard " + topCard.name, () => {
                        game.dealer.discard(topCard);
                        return undefined;
                    })
                );
            }
            return new OrOptions(
                new SelectOption("Buy card " + topCard.name, () => {
                    if (player.megaCredits < 3) {
                        game.dealer.discard(topCard);
                        throw "Can not afford to buy card";
                    }
                    player.megaCredits -= 3;
                    player.cardsInHand.push(topCard);
                    return undefined;
                }),
                new SelectOption("Discard " + topCard.name, () => {
                    game.dealer.discard(topCard);
                    return undefined;
                })
            );
        }
        // Can't afford a card, will have to discard
        game.dealer.discard(topCard);
        return undefined; 
    }
}
