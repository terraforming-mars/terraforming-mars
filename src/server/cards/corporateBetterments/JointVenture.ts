import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';

export class JointVenture extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.JOINT_VENTURE,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 16,
      victoryPoints: 1,
      metadata: {
        cardNumber: 'B35',
        description: 'Decrease any opponent\'s Energy production 1 step. Place a City tile credited to both you and the opponent.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1)).asterix().br;
          b.city().asterix();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    // TODO: Select opponent, decrease their energy prod, place shared city tile.
    // Shared city ownership requires engine-level changes to space.player logic.
    player.game.log('${0} played Joint Venture (shared city mechanic pending engine support)', (b) => b.player(player));
    return undefined;
  }
}
