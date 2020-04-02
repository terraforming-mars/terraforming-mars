import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { CardType } from "../cards/CardType";
import { Tags } from "../cards/Tags";

export class Diversifier implements IMilestone {
    public name: string = "Diversifier";
    public description: string = "Requires that you have 8 different tags in play"
    public canClaim(player: Player): boolean {
        const allTags: Tags[] = [];
        let wildcardCount: number = 0;
        const uniqueTags: Set<Tags> = new Set<Tags>();
        if (player.corporationCard !== undefined && player.corporationCard.tags.length > 0) {
          player.corporationCard.tags.forEach((tag) => allTags.push(tag));
        }
        player.playedCards.filter((card) => card.cardType !== CardType.EVENT)
          .forEach((card) => {
            card.tags.forEach((tag) => {
              allTags.push(tag);
            });
          });
        for (const tags of allTags) {
          if (tags === Tags.WILDCARD) {
            wildcardCount++;
          } else {
            uniqueTags.add(tags);
          }
        }
        return uniqueTags.size + wildcardCount >= 8;
    }   
}
