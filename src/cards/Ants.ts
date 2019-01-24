
import { IActiveProjectCard } from "./IActiveProjectCard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class Ants implements IActiveProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Ants";
    public microbes: number = 0;
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Remove 1 microbe from any card to add 1 to this card.";
    public text: string = "Requires 4% oxygen. Gain 1 victory point per 2 microbes on this card.";
    public description: string = "Although an important part of many ecosystems, ants can also be detrimental to other organisms.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 4) {
            return Promise.reject("Requires 4% oxygen");
        }
        game.addGameEndListener(() => {
            player.victoryPoints += Math.floor(this.microbes / 2);
        });
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        const availableCards: Array<IProjectCard> = [];
        game.getPlayers().forEach((gamePlayer) => {
            gamePlayer.playedCards.forEach((playedCard) => {
                if (playedCard.microbes > 0) {
                    availableCards.push(playedCard);
                }
            });
        });
        if (availableCards.length === 0) {
            return Promise.reject("No cards to remove microbes from");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectCard(this, "Select card to remove microbe", availableCards), (options: {[x: string]: string}) => {
                const foundCard = availableCards.filter((card) => card.name === options.option1)[0];
                if (foundCard === undefined) {
                    reject("Card not found");
                    return;
                }
                foundCard.microbes--;
                this.microbes++;
                resolve();
            });
        });
    }
}
