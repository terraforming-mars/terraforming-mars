import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Resources } from "../../Resources";
import { IResourceCard } from '../ICard';

export class RefugeeCamps implements IProjectCard, IResourceCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.REFUGEE_CAMP;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.CAMP;
    public resourceCount: number = 0;

    public canAct(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -4;
    } 

    public action(player: Player) {
        player.setProduction(Resources.MEGACREDITS, -1);
        this.resourceCount++;
        return undefined;
    } 

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
        return this.resourceCount;
    }
}

