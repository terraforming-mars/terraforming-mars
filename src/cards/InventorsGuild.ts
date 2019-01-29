
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { DoNothing } from "../inputs/DoNothing";
import { SelectCard } from "../inputs/SelectCard";
import { IProjectCard } from "./IProjectCard";

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
            player.setWaitingFor(
                new OrOptions(
                    new SelectCard(this.name, "Buy card", [topCard], (_card: Array<IProjectCard>) => {
                        if (player.megaCredits < 3) {
                            reject("Can not afford to buy card");
                        } else {
                            player.megaCredits -= 3;
                            player.cardsInHand.push(topCard);
                            resolve();
                        }
                    }),
                    new DoNothing(this.name, "Discard it", () => {
                        game.dealer.discard(topCard);
                        resolve();
                    })
                )
            );
        });
    }
}
