import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {StealResources} from '../../deferredActions/StealResources';

export class AirRaid implements IProjectCard {
    public cost = 0;
    public tags = [];
    public name = CardName.AIR_RAID;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
      return player.getResourceCount(ResourceType.FLOATER) > 0;
    }

    public play(player: Player, game: Game) {
      game.defer(new RemoveResourcesFromCard(player, game, ResourceType.FLOATER, 1, true));
      game.defer(new StealResources(player, game, Resources.MEGACREDITS, 5));
      return undefined;
    }
}
