
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { SelectCard } from "../inputs/SelectCard";

export class SymbioticFungus implements IProjectCard {
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
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, _reject) => {
            const availableCards = game.getOtherMicrobeCards(this);
            player.setWaitingFor(new SelectCard(this.name, "Select card for microbe", availableCards, (foundCards: Array<IProjectCard>) => {
                foundCards[0]!.microbes!++;
                resolve();
            }));
        });
    }
}
 
