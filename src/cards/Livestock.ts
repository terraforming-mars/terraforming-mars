
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { ResourceType } from "../ResourceType";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Livestock implements IActionCard, IProjectCard {
    public cost: number = 13;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = CardName.LIVESTOCK;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 9 - player.getRequirementsBonus(game) && player.getProduction(Resources.PLANTS) >= 1;
    }
    public getVictoryPoints(player: Player): number {
        return player.getResourcesOnCard(this);
    }
    public play(player: Player) {
        player.setProduction(Resources.PLANTS,-1);
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
}
    
