
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
    public canPlay(_player: Player, game: Game): boolean {
        return game.getTemperature() >= -14;
    }
    public play(_player: Player, game: Game) {
        if (game.getTemperature() < -14) {
            throw "Requires -14C or warmer";
        }
        return undefined;
    }
    public action(_player: Player, game: Game) {
        const availableCards = game.getOtherMicrobeCards(this);
        if (availableCards.length === 0) {
            throw "No cards available";
        }
        return new SelectCard(this.name, "Select card for microbe", availableCards, (foundCards: Array<IProjectCard>) => {
            foundCards[0]!.microbes!++;
            return undefined;
        });
    }
}
 
