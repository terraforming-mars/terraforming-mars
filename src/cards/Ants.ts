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

export class Ants implements IActionCard, IProjectCard, IResourceCard {
    public cost = 9;
    public tags = [Tags.MICROBES];
    public name = CardName.ANTS;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
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
