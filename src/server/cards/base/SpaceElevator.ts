import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceElevator extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SPACE_ELEVATOR,
      tags: [Tag.SPACE, Tag.BUILDING],
      cost: 27,

      behavior: {
        production: {titanium: 1},
      },
      victoryPoints: 2,

      metadata: {
        cardNumber: '203',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel to gain 5 M€.', (eb) => {
            eb.steel(1).startAction.megacredits(5);
          }).br;
          b.production((pb) => pb.titanium(1));
        }),
        description: 'Increase your titanium production 1 step.',
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.steel > 0;
  }
  public action(player: Player) {
    player.steel--;
    player.megaCredits += 5;
    return undefined;
  }
}
