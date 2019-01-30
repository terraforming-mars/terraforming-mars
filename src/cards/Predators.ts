
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class Predators implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Predator";
    public cardType: CardType = CardType.ACTIVE;
    public animals: number = 0;
    public actionText: string = "Remove 1 animal from any card and add it to this card";
    public text: string = "Requires 11% oxygen. Gain 1 victory point per animal on this card.";
    public description: string = "Lions and tigers and bears, oh my.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 11) {
            return Promise.reject("Requires 11% oxygen");
        }
        game.addGameEndListener(() => {
            player.victoryPoints += this.animals;
        });
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        const animalCards: Array<IProjectCard> = [];
        game.getPlayers().forEach((otherPlayer) => {
            otherPlayer.playedCards.forEach((card) => {
                if (card.animals !== undefined && card.animals > 0) {
                    animalCards.push(card);
                }
            });
        });
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectCard(this.name, "Select card to remove animal from", animalCards, (foundCards: Array<IProjectCard>) => {
                const foundCard = foundCards[0];
                if (foundCard.animals === undefined) {
                    reject("Card does not have animals");
                    return;
                }
                if (foundCard.animals < 1) {
                    reject("No animals to remove from card");
                    return;
                }
                foundCard.animals--;
                this.animals++;
                resolve();
            }));
        });
    }
}
