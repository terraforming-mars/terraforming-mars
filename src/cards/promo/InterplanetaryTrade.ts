import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from "../../Resources";

export class InterplanetaryTrade implements IProjectCard {

    public name: CardName = CardName.INTERPLANETARY_TRADE;
    public cost: number = 27;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        const allTags: Tags[] = [Tags.SPACE];
        let wildcardCount: number = 0;
        const uniqueTags: Set<Tags> = new Set<Tags>();
        if (player.corporationCard !== undefined && player.corporationCard.tags.length > 0) {
            player.corporationCard.tags.forEach((tag) => allTags.push(tag));
        }
        player.playedCards.filter((card) => card.cardType !== CardType.EVENT).forEach((card) => {
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
        // Only count wildcards up to the max amount of tag types existing (minus events and wildcards)
        const availableTags = uniqueTags.size + wildcardCount;
        const existingTags = Object.keys(Tags).length - 2;
        player.setProduction(Resources.MEGACREDITS, Math.min(availableTags, existingTags));
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }

}
