
import { Tags } from "./Tags";
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { SelectCard } from "../inputs/SelectCard";

export class SymbioticFungus implements IActiveProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Symbiotic Fungus";
    public text: string = "Requires -14C or warmer.";
    public description: string = "Creating mutually beneficial conditions";
    public actionText: string = "Add a microbe to ANOTHER card";
    public play(_player: Player, game: Game): Promise<void> {
        if (game.getTemperature() < -14) {
            return Promise.reject("Requires -14C or warmer");
        }
        return Promise.resolve();
    }
    public action(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const availableCards = player.playedCards.filter((card) => card.microbes !== undefined && card.name !== this.name);
            player.setWaitingFor(new SelectCard(this, "Select card for microbe", availableCards), (cardName: string) => {
                if (cardName === this.name) {
                    reject("Must put resource on another card");
                    return;
                }
                const foundCard = availableCards.filter((card) => card.name === cardName)[0];
                if (foundCard === undefined) {
                    reject("Card not found");
                    return;
                }
                if (foundCard.microbes === undefined) {
                    reject("No microbes on this card");
                    return;
                }
                foundCard.microbes++;
                resolve();
            });
        });
    }
}
 
