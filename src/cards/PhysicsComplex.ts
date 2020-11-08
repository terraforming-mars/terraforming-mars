
import { IActionCard, IResourceCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";
import { CardName } from "../CardName";

export class PhysicsComplex implements IActionCard, IProjectCard, IResourceCard {
    public cost = 12;
    public tags = [Tags.SCIENCE, Tags.STEEL];
    public name = CardName.PHYSICS_COMPLEX;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.SCIENCE;
    public resourceCount: number = 0;

    public getVictoryPoints(): number {
        return 2 * this.resourceCount;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy >= 6;
    }
    public action(player: Player) {
        player.energy -= 6;
        this.resourceCount++;
        return undefined;
    }
}
