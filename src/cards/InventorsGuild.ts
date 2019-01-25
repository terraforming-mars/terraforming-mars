
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { BuyOrDiscard } from "../inputs/BuyOrDiscard";

export class InventorsGuild implements IActiveProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Inventors' Guild";
    public cardType: CardType = CardType.ACTIVE;
    public actionText = "Look at the top card and either buy it or discard it";
    public description: string = "When great minds meet, new ideas abount";
    public text: string = "";
    public play(_player: Player, _game: Game): Promise<void> {
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const topCard = game.dealer.getCards(1)[0];
            player.setWaitingFor(new BuyOrDiscard(this, topCard), (options: {[x: string]: string}) => {
                if (options.option1 === "DISCARD") {
                    game.dealer.discard(topCard);
                    resolve();
                } else if (options.option1 === "BUY") {
                    if (player.megaCredits < 3) {
                        reject("Can not afford to buy card");
                    } else {
                        player.megaCredits -= 3;
                        player.cardsInHand.push(topCard);
                        resolve();
                    }
                } else {
                    reject("Unknown selection");
                }
            });
        });
    }
}
