import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Resource} from '../../../common/Resource';

export class LunarMantleExcavation extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.LUNAR_MANTLE_EXCAVATION,
      tags: [Tag.POWER, Tag.MOON],
      cost: 15,
      victoryPoints: 3,

      behavior: {
        production: {energy: -3},
      },

      metadata: {
        cardNumber: 'B24',
        description: 'Decrease your Energy production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend X Energy to gain X Steel.', (ab) => {
            ab.text('x').energy(1).startAction.text('x').steel(1);
          }).br;
          b.production((pb) => pb.minus().energy(3));
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
        player.stock.add(Resource.STEEL, amount, {log: true});
        return undefined;
      });
  }
}
