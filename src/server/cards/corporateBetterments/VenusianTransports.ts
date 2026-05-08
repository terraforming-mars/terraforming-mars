import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class VenusianTransports extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VENUSIAN_TRANSPORTS,
      tags: [Tag.SPACE, Tag.VENUS],
      cost: 22,
      victoryPoints: 1,
      requirements: {venus: 12},
      metadata: {
        cardNumber: 'B32',
        description: 'Requires at least 12% Venus.',
        renderData: CardRenderer.builder((b) => {
          b.action('Get 1 M€ for each Venus tag you own.', (ab) => {
            ab.empty().startAction.megacredits(1).slash().tag(Tag.VENUS, {size: Size.SMALL});
          });
        }),
      },
    });
  }

  public canAct(_player: IPlayer): boolean {
    return true;
  }

  public action(player: IPlayer) {
    const count = player.tags.count(Tag.VENUS, 'raw');
    if (count > 0) player.stock.add(Resource.MEGACREDITS, count, {log: true});
    return undefined;
  }
}
