import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard} from '../ICard';
import {SelectAmount} from '../../inputs/SelectAmount';
import {message} from '../../logs/MessageBuilder';
import {Resource} from '../../../common/Resource';

export class VoltaicMetallurgy extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      name: CardName.VOLTAIC_METALLURGY,
      type: CardType.ACTIVE,
      cost: 8,
      tags: [Tag.SCIENCE, Tag.POWER],

      requirements: {tag: Tag.SCIENCE, count: 1},

      metadata: {
        cardNumber: 'U76',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend any number of steel to gain the same amount of titanium (max is the number of power tags you have.)', (ab) => {
            ab.text('X').steel(1, {secondaryTag: Tag.POWER}).startAction.text('X').titanium(1);
          });
        }),
        description: 'Requires 1 science tag.',
      },
    });
  }

  public canAct(player: IPlayer) {
    return player.tags.count(Tag.POWER) > 0 && player.stock.steel > 0;
  }

  public action(player: IPlayer) {
    const max = Math.min(player.tags.count(Tag.POWER), player.stock.steel);
    return new SelectAmount(
      message('Select up to ${1} steel to convert to titanium', (b) => b.number(max)),
      'Convert Steel', 1, max, false)
      .andThen((amount) => {
        player.stock.deduct(Resource.STEEL, amount);
        player.stock.add(Resource.TITANIUM, amount);
        player.game.log('${0} converted ${1} units of steel to titanium.', (b) => b.player(player).number(amount));
        return undefined;
      });
  }
}
