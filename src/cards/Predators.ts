import { IActionCard, ICard, IResourceCard } from './ICard';
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { SelectCard } from "../inputs/SelectCard";
import { Pets } from "./Pets";
import { CardName } from '../CardName';

export class Predators implements IProjectCard, IActionCard, IResourceCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: CardName = CardName.PREDATORS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 11 - player.getRequirementsBonus(game);
    }
    public getVictoryPoints(): number {
        return this.resourceCount;
    }
    public play() {
        return undefined;
    }

    private getPossibleTargetCards(player: Player, game: Game): Array<ICard> {
        let possibleCards = new Array<ICard>(); 
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

    private doAction(targetCard:ICard, player: Player, game: Game): void {
        game.getCardPlayer(targetCard.name).removeAnimals(player, targetCard, 1, game);
        this.resourceCount++;
    }

    public canAct(player: Player, game: Game): boolean {
        if (game.soloMode) return true;
        return this.getPossibleTargetCards(player, game).length > 0;
    }

    public action(player: Player, game: Game) {
        // Solo play, can always steal from immaginary opponent
        if (game.soloMode) {
            this.resourceCount++;
            return undefined;
        }
        const animalCards = this.getPossibleTargetCards(player, game);
        if (animalCards.length === 1) {
            this.doAction(animalCards[0], player, game)
            return undefined;
        }

        return new SelectCard(
            "Select card to remove animal from", 
            animalCards, 
            (foundCards: Array<ICard>) => {
                this.doAction(foundCards[0], player, game)
                return undefined;
            }
        );
    }
}
