import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';

export class SmallAnimals implements IActionCard, IProjectCard, IResourceCard {
    public cost = 6;
    public tags = [Tags.ANIMAL];
    public name = CardName.SMALL_ANIMALS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.PLANTS, 1));
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
