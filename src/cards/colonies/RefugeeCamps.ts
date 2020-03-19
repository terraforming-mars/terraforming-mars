import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Resources } from "../../Resources";

export class RefugeeCamps implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.REFUGEE_CAMP;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.CAMP;

    public canAct(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) > -4;
    } 

    public action(player: Player) {
        player.setProduction(Resources.MEGACREDITS, -1);
        player.addResourceTo(this);
        return undefined;
    } 

    public play() {
      return undefined;
    }

    public getVictoryPoints(player: Player): number {
        return player.getResourcesOnCard(this);
    }
}

