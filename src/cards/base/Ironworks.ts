import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class Ironworks extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.IRONWORKS,
      tags: [Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '101',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 1 steel and raise oxygen 1 step.', (eb) => {
            eb.energy(4, {digit}).startAction.steel(1).oxygen(1);
          });
        }),
      },
    });
  }

  public play(_player: Player) {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.energy >= 4 && player.canAfford(0, {tr: {oxygen: 1}});
  }
  public action(player: Player) {
    player.energy -= 4;
    player.steel++;
    return player.game.increaseOxygenLevel(player, 1);
  }
}
