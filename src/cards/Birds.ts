
import { IActionCard, IResourceCard } from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ResourceType} from '../ResourceType';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Birds implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: CardName = CardName.BIRDS;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 13 - player.getRequirementsBonus(game) && game.someoneHasResourceProduction(Resources.PLANTS,2);
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
    }
    public play(player: Player, game: Game) {
      game.addResourceProductionDecreaseInterrupt(player, Resources.PLANTS, 2);
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
