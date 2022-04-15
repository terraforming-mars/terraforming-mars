import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {StealResources} from '../../deferredActions/StealResources';
import {Card} from '../Card';
import {Size} from '../../common/cards/render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class AirRaid extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 0,
      name: CardName.AIR_RAID,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C02',
        description: 'Requires that you lose 1 floater. Steal 5 M€ from any player.',
        renderData: CardRenderer.builder((b) => {
          b.minus().floaters(1);
          b.text('steal', Size.MEDIUM, true).megacredits(5, {all});
        }),
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.getResourceCount(CardResource.FLOATER) > 0;
  }

  public play(player: Player) {
    player.game.defer(new StealResources(player, Resources.MEGACREDITS, 5));
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, true));
    return undefined;
  }
}
