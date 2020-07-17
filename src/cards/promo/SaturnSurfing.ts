import { IProjectCard } from "../IProjectCard";
import { IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";

export class SaturnSurfing implements IActionCard, IProjectCard, IResourceCard {
    public name: CardName = CardName.SATURN_SURFING;
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.EARTH];
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play(player: Player) {
        this.resourceCount = player.getTagCount(Tags.EARTH) + 1;
        return undefined;
    }

    public canAct(): boolean {
        return this.resourceCount > 0;
    }

    public action(player: Player) {
        player.setResource(Resources.MEGACREDITS, Math.min(5, this.resourceCount--));
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }

}