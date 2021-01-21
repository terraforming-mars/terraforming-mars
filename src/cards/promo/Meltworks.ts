import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Meltworks extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MELTWORKS,
      tags: [Tags.BUILDING],
      cost: 4,

      metadata: {
        cardNumber: 'X21',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 5 heat to gain 3 steel.', (eb) => {
            eb.heat(5).digit.startAction.steel(3);
          });
        }),
      },
    });
  }

  public play(_player: Player) {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.availableHeat >= 5;
  }
  public action(player: Player) {
    return player.spendHeat(5, () => {
      player.steel += 3;
      return undefined;
    });
  }
}
