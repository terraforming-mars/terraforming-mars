import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IActionCard} from '@/server/cards/ICard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {SelectAmount} from '@/server/inputs/SelectAmount';
import {CardName} from '@/common/cards/CardName';
import {Resource} from '@/common/Resource';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class PowerInfrastructure extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.POWER_INFRASTRUCTURE,
      tags: [Tag.POWER, Tag.BUILDING],
      cost: 4,

      metadata: {
        cardNumber: '194',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend any amount of energy and gain that amount of M€.', (eb) => {
            eb.text('x').energy(1).startAction.megacredits(1, {text: 'x'});
          });
        }),
      },
    });
  }
  public canAct(player: IPlayer): boolean {
    return player.energy > 0;
  }
  public action(player: IPlayer) {
    return new SelectAmount('Select amount of energy to spend', 'Spend energy', 1, player.energy)
      .andThen((amount) => {
        player.stock.deduct(Resource.ENERGY, amount);
        player.stock.add(Resource.MEGACREDITS, amount, {log: true});
        return undefined;
      });
  }
}
