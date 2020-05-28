import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from '../ResourceType';

export class Hoverlord implements IMilestone {
    public name: string = "Hoverlord";
    public description: string = "Having at least 7 floater resources on your cards"
    public canClaim(player: Player, _game: Game): boolean {
        let floaterResources: number = 0;
        player.getCardsWithResources().filter(card => card.resourceType === ResourceType.FLOATER).forEach((card) => {
            floaterResources += player.getResourcesOnCard(card);
        });
        return floaterResources >= 7;
    }   
}
