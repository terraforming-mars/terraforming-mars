
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";
import { CardName } from '../CardName';

export class PhysicsComplex implements IActionCard, IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public name: string = CardName.PHYSICS_COMPLEX;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.SCIENCE;

    public getVictoryPoints(player: Player): number {
        return 2 * player.getResourcesOnCard(this);
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy >= 6;
    }
    public action(player: Player) {
        player.energy -= 6;
        player.addResourceTo(this);
        return undefined;
    }
}
