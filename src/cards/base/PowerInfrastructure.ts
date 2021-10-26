import {Card} from '../Card';
import {CardType} from '../CardType';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {multiplier} from '../Options';

export class PowerInfrastructure extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.POWER_INFRASTRUCTURE,
      tags: [Tags.ENERGY, Tags.BUILDING],
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

  public play(_player: Player) {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.energy > 0;
  }
  public action(player: Player) {
    return new SelectAmount(
      'Select amount of energy to spend',
      'Spend energy',
      (amount: number) => {
        player.deductResource(Resources.ENERGY, amount);
        player.addResource(Resources.MEGACREDITS, amount, {log: true});
        return undefined;
      },
      1,
      player.energy,
    );
  }
}
