import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {multiplier} from '../Options';

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
            eb.text('x').energy(1).startAction.megacredits(0, {multiplier});
          });
        }),
      },
    });
  }
  public canAct(player: Player): boolean {
    return player.energy > 0;
  }
  public action(player: Player) {
    return new SelectAmount(
      'Select amount of energy to spend',
      'Spend energy',
      (amount: number) => {
        player.deductResource(Resource.ENERGY, amount);
        player.addResource(Resource.MEGACREDITS, amount, {log: true});
        return undefined;
      },
      1,
      player.energy,
    );
  }
}
