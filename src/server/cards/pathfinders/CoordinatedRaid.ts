import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {Card} from '@/server/cards/Card';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {SelectColony} from '@/server/inputs/SelectColony';
import {IColony} from '@/server/colonies/IColony';
import {all} from '@/server/cards/Options';

export class CoordinatedRaid extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      name: CardName.COORDINATED_RAID,
      type: CardType.EVENT,
      requirements: {colonies: 1, all},

      metadata: {
        cardNumber: 'Pf64',
        renderData: CardRenderer.builder((b) => b.trade().asterix()),
        // TODO(kberg): restoring this behaivor will be quite a tricky thing, mostly for visualization etc.
        // description: 'Requires at least 1 colony in play. Send one of your unused Trade Fleets to ANY colony tile (can be a tile already used this generation.) ' +
        //   'Collect the trade bonus and colony bonus for every colony on this tile. Other players do not get their colony bonuses from this action.',
        description: 'Requires at least 1 colony in play. Send one of your unused Trade Fleets to any colony tile. ' +
          'Collect the trade bonus and colony bonus for every colony on this tile. Other players do not get their colony bonuses from this action.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.colonies.getFleetSize() > player.colonies.usedTradeFleets;
  }

  public override bespokePlay(player: IPlayer) {
    const activeColonies = player.game.colonies.filter((colony) => colony.isActive);
    return new SelectColony('Select colony tile for trade', 'trade', activeColonies)
      .andThen((colony: IColony) => {
        colony.trade(player, {selfishTrade: true});
        return undefined;
      });
  }
}
