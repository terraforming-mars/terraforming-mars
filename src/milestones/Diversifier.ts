import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from '../cards/Tags';
import { CardType } from "../cards/CardType";

export class Diversifier implements IMilestone {
    public name: string = "Diversifier";
    public description: string = "Requires that you have 8 different tags in play"
    public canClaim(player: Player, _game: Game): boolean {
        let allTags: Array<Tags> = [];
        if (player.corporationCard !== undefined && player.corporationCard.tags.length > 0) {
          allTags.push(...player.corporationCard.tags);
        }
        player.playedCards.filter((card) => card.cardType !== CardType.EVENT)
          .forEach(card => {
            allTags.push(...card.tags);  
          }
        ); 
        allTags.filter((tag, index) => index === allTags.indexOf(tag));
        
        return allTags.length >= 8;
    }   
}