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
        player.addProduction(Resources.MEGACREDITS, player.getNoTagsCount() + 1);
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}
