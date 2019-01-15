
import { Tags } from "./Tags";
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";

export class SymbioticFungus implements IActiveProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Symbiotic Fungus";
    public text: string = "Requires -14C or warmer.";
    public description: string = "Creating mutually beneficial conditions";
    public actionText: string = "Add a microbe to ANOTHER card";
    public play(player: Player, game: Game): Promise<void> {
        if (game.temperature < -14) {
            return Promise.reject("Requires -14C or warmer");
        }
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const availableCards = player.playedCards.filter((card) => card.microbes >= 0 && card.name !== this.name);
            player.setWaitingFor({
                initiator: "card",
                card: this as IProjectCard,
                type: "SelectACardForFree",
                cards: availableCards
            }, (cardName: string) => {
                if (cardName === this.name) {
                    reject("Must put resource on another card");
                    return;
                }
                const foundCard = availableCards.filter((card) => card.name === cardName)[0];
                if (foundCard === undefined) {
                    reject("Card not found");
                    return;
                }
                foundCard.microbes++;
                resolve();
            });
        });
    }
}
 
