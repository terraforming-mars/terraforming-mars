import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";

export class Excentric implements IAward {
    public name: string = "Excentric";
    public description: string = "Most resources on cards"
    public getScore(player: Player, _game: Game): number {
        let score: number = 0;
        if (player.corporationCard !== undefined) {
          score += player.getResourcesOnCard(player.corporationCard);
        }  
        player.playedCards.forEach(card => {
            // exclude Self Replicating Robots
            if (card.resourceType !== ResourceType.ROBOT) {
                score += player.getResourcesOnCard(card);
            }
        });
        return score;
    }   
}