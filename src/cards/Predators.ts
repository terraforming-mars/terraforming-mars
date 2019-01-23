
import { IProjectCard } from "./IProjectCard";
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class Predators implements IActiveProjectCard {
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
    }
    public action(player: Player, game: Game): Promise<void> {
        const animalCards: Array<IProjectCard> = [];
        game.getPlayers().forEach((otherPlayer) => {
            otherPlayer.playedCards.forEach((card) => {
                if (card.animals > 0) {
                    animalCards.push(card);
                }
            });
        });
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectCard(this, "Select card to remove animal from", animalCards), (options: {[x: string]: string}) => {
                const foundCard: IProjectCard | undefined = animalCards.filter((card) => card.name === options.option1)[0];
                if (foundCard === undefined) {
                    reject("Card not found");
                    return;
                }
                if (foundCard.animals < 1) {
                    reject("No animals to remove from card");
                    return;
                }
                foundCard.animals--;
                this.animals++;
                resolve();
            });
        });
    }
}
