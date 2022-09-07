import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class Steelworks extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.STEELWORKS,
      tags: [Tag.BUILDING],
      cost: 15,

      metadata: {
        cardNumber: '103',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 2 steel and increase oxygen 1 step.', (eb) => {
            eb.energy(4, {digit}).startAction.steel(2).oxygen(1);
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
    player.steel += 2;
    player.game.increaseOxygenLevel(player, 1);
    return undefined;
  }
}
