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
        // This card tag is counting as well
        const availableTags = player.getDistinctTagCount(true, Tags.SPACE);
        // Only count wildcards up to the max amount of tag types existing (minus events and wildcards)
        const existingTags = Object.keys(Tags).length - 2;
        player.setProduction(Resources.MEGACREDITS, Math.min(availableTags, existingTags));
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }

}
