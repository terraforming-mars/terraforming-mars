import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class OreProcessor extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ORE_PROCESSOR,
      tags: [Tags.BUILDING],
      cost: 13,

      metadata: {
        cardNumber: '104',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 1 titanium and increase oxygen 1 step.', (eb) => {
            eb.energy(4, {digit}).startAction.titanium(1).oxygen(1);
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
    player.titanium++;
    return player.game.increaseOxygenLevel(player, 1);
  }
}
