
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

export class Ants implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Ants";
    public microbes: number = 0;
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Remove 1 microbe from any card to add 1 to this card.";
    public text: string = "Requires 4% oxygen. Gain 1 victory point per 2 microbes on this card.";
    public description: string = "Although an important part of many ecosystems, ants can also be detrimental to other organisms.";
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() < 4) {
            throw "Requires 4% oxygen";
        }
        game.addGameEndListener(() => {
            player.victoryPoints += Math.floor(this.microbes / 2);
        });
        return undefined;
    }
    public action(_player: Player, game: Game) {
        const availableCards: Array<IProjectCard> = [];
        game.getPlayers().forEach((gamePlayer) => {
            gamePlayer.playedCards.forEach((playedCard) => {
                if (playedCard.microbes !== undefined && playedCard.microbes > 0) {
                    availableCards.push(playedCard);
                }
            });
        });
        if (availableCards.length === 0) {
            throw "No cards to remove microbes from";
        }
        return new SelectCard(this.name, "Select card to remove microbe", availableCards, (foundCards: Array<IProjectCard>) => {
            foundCards[0]!.microbes!--;
            this.microbes++;
            return undefined;
        });
    }
}
