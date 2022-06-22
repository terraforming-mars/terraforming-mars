import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {SelectColony} from '../../inputs/SelectColony';
import {IColony} from '../../colonies/IColony';

export class CoordinatedRaid extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      name: CardName.COORDINATED_RAID,
      cardType: CardType.EVENT,
      requirements: CardRequirements.builder((b) => b.colonies(1)),

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

  public override canPlay(player: Player): boolean {
    return player.getFleetSize() > player.tradesThisGeneration;
  }

  public play(player: Player) {
    const colonies = player.game.colonies.filter((colony) => colony.isActive);
    return new SelectColony('Select colony tile for trade', 'trade', colonies, (colony: IColony) => {
      colony.trade(player, {selfishTrade: true});
      return undefined;
    });
  }
}
