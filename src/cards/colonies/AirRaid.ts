import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {StealResources} from '../../deferredActions/StealResources';
import {Card} from '../Card';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderer} from '../render/CardRenderer';

export class AirRaid extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 0,
      name: CardName.AIR_RAID,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C02',
        description: 'Requires that you lose 1 floater. Steal 5 MC from any player.',
        renderData: CardRenderer.builder((b) => {
          b.minus().floaters(1);
          b.text('steal', CardRenderItemSize.MEDIUM, true).megacredits(5).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getResourceCount(ResourceType.FLOATER) > 0;
  }

  public play(player: Player) {
    player.game.defer(new StealResources(player, Resources.MEGACREDITS, 5));
    player.game.defer(new RemoveResourcesFromCard(player, ResourceType.FLOATER, 1, true));
    return undefined;
  }
}
