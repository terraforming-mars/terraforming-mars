import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from '../ResourceType';

export class Hoverlord implements IMilestone {
    public name: string = "Hoverlord";
    public description: string = "Having at least 7 floater resources on your cards"
    public canClaim(player: Player, _game: Game): boolean {
        let floaterResources: number = 0;
        if (player.corporationCard !== undefined 
                && player.corporationCard.resourceType === ResourceType.FLOATER
                && player.corporationCard.resourceCount
                && player.corporationCard.resourceCount > 0) {
            floaterResources += player.corporationCard.resourceCount;
        }
        player.playedCards.forEach((card) => {
            if (card.resourceType === ResourceType.FLOATER) {
                floaterResources += player.getResourcesOnCard(card);
            }
          });
        return floaterResources >= 7;
    }   
}
