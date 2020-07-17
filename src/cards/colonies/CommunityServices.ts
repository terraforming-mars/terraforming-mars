import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";

export class CommunityServices implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.COMMUNITY_SERVICES;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        let noTagsCount: number = 0;
        if (player.corporationCard !== undefined && player.corporationCard.tags.filter(tag => tag !== Tags.WILDCARD).length === 0) {
            noTagsCount++;
        }
        player.setProduction(Resources.MEGACREDITS,
            player.playedCards.filter((card) => card.cardType !== CardType.EVENT 
                    && card.tags.filter(tag => tag !== Tags.WILDCARD).length === 0).length + noTagsCount + 1);
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}
