
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { SelectCard } from "../inputs/SelectCard";

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
    public canAct(player: Player, game: Game): boolean {
        return game.getPlayedCardsWithAnimals().find((card) => player.getResourcesOnCard(card) > 0) !== undefined;
    }
    public action(player: Player, game: Game) {
        const animalCards: Array<IProjectCard> = game.getPlayedCardsWithAnimals()
            .filter((card) => player.getResourcesOnCard(card) > 0);
        return new SelectCard("Select card to remove animal from", animalCards, (foundCards: Array<IProjectCard>) => {
            const foundCard = foundCards[0];
            game.getCardPlayer(foundCard.name).removeAnimals(player, foundCard, 1);
            player.addResourceTo(this);
            return undefined;
        });
    }
}
