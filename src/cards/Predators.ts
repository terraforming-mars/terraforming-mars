import {IActionCard, IResourceCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ResourceType} from '../ResourceType';
import {CardName} from '../CardName';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {RemoveResourcesFromCard} from '../deferredActions/RemoveResourcesFromCard';

export class Predators implements IProjectCard, IActionCard, IResourceCard {
    public cost = 14;
    public tags = [Tags.ANIMAL];
    public name = CardName.PREDATORS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;

    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 11 - player.getRequirementsBonus(game);
    }

    public getVictoryPoints(): number {
      return this.resourceCount;
    }

    public play() {
      return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
      if (game.isSoloMode()) return true;
      return RemoveResourcesFromCard.getAvailableTargetCards(player, game, this.resourceType).length > 0;
    }

    public action(player: Player, game: Game) {
      game.defer(new RemoveResourcesFromCard(player, game, this.resourceType));
      game.defer(new DeferredAction(
          player,
          () => {
            player.addResourceTo(this);
            return undefined;
          },
      ));
      return undefined;
    }
}
