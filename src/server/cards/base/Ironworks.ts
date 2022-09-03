import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card2} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class Ironworks extends Card2 implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.IRONWORKS,
      tags: [Tag.BUILDING],
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
  public canAct(player: Player): boolean {
    return player.energy >= 4 && player.canAfford(0, {tr: {oxygen: 1}});
  }
  public action(player: Player) {
    player.energy -= 4;
    player.steel++;
    return player.game.increaseOxygenLevel(player, 1);
  }
}
