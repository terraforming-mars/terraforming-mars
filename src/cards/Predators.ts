import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { SelectCard } from "../inputs/SelectCard";
import { Pets } from "./Pets";

export class Predators implements IProjectCard, IActionCard {
    public cost: number = 14;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Predators";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 11 - player.getRequirementsBonus(game);
    }
    public getVictoryPoints(player: Player) {
        return player.getResourcesOnCard(this);
    }
    public play() {
        return undefined;
    }

    private getPossibleTargetCards(player: Player, game: Game): Array<IProjectCard> {
        let possibleCards = new Array<IProjectCard>(); 
        const petsCard = new Pets();
        for (let card of game.getPlayedCardsWithAnimals()) {  
            let owner = game.getCardPlayer(card.name);
            if (player.id != owner.id && owner.hasProtectedHabitats()) continue;
            if (owner.getResourcesOnCard(card) < 1) continue;
            if (this.name === card.name) continue;
            if (card.name === petsCard.name) continue;
            possibleCards.push(card);
        }
        return possibleCards;
    }

    private doAction(targetCard:IProjectCard, player: Player, game: Game): void {
        game.getCardPlayer(targetCard.name).removeAnimals(player, targetCard, 1);
        player.addResourceTo(this);
    }

    public canAct(player: Player, game: Game): boolean {
        return this.getPossibleTargetCards(player, game).length > 0;
    }

    public action(player: Player, game: Game) {
        const animalCards = this.getPossibleTargetCards(player, game);
        if (animalCards.length === 1) {
            this.doAction(animalCards[0], player, game)
            return undefined;
        }

        return new SelectCard(
            "Select card to remove animal from", 
            animalCards, 
            (foundCards: Array<IProjectCard>) => {
                this.doAction(foundCards[0], player, game)
                return undefined;
            }
        );
    }
}
