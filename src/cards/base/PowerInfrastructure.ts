import {Card} from '../Card';
import {CardType} from '../CardType';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';

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
          b.effectBox((eb) => {
            eb.text('x').energy(1).startAction.megacredits(0).multiplier;
            eb.description('Action: Spend any amount of Energy and gain that amount of MC.');
          });
        }),
      },
    });
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.energy > 0;
  }
  public action(player: Player, game: Game) {
    return new SelectAmount(
      'Select amount of energy to spend',
      'Spend energy',
      (amount: number) => {
        player.energy -= amount;
        player.megaCredits += amount;
        LogHelper.logGainStandardResource(game, player, Resources.MEGACREDITS, amount);
        return undefined;
      },
      1,
      player.energy,
    );
  }
}
