
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class SmallAnimals implements IActionCard, IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = CardName.SMALL_ANIMALS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public canPlay(player: Player, game: Game): boolean {
        if (game.getPlayers().length > 1 && game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 0).length === 0) return false;
        return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game);
    }
    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }
    public play(player: Player, game: Game) {
        game.addPlantProductionDecreaseInterrupt(player, 1);
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
