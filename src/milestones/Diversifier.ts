import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "../cards/CardType";

export class Diversifier implements IMilestone {
    public name: string = "Diversifier";
    public description: string = "Requires that you have 8 different tags in play"
    public canClaim(player: Player, _game: Game): boolean {
        let allTags = new Set();
        if (player.corporationCard !== undefined && player.corporationCard.tags.length > 0) {
          player.corporationCard.tags.forEach(tag => {
            allTags.add(tag);
          });
        }
        player.playedCards.filter((card) => card.cardType !== CardType.EVENT)
          .forEach(card => {
            card.tags.forEach(tag => {
              allTags.add(tag);
            });  
          }
        );        
        return allTags.size >= 8;
    }   
}