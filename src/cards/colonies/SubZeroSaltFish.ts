import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {IResourceCard} from '../ICard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';

export class SubZeroSaltFish implements IProjectCard, IResourceCard {
    public cost = 5;
    public tags = [Tags.ANIMAL];
    public name = CardName.SUBZERO_SALT_FISH;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;

    public canAct(): boolean {
      return true;
    }

    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -6 - (player.getRequirementsBonus(game) * 2) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }

    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }

    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.PLANTS, 1));
      return undefined;
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
}
