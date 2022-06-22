import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class SpaceElevator extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SPACE_ELEVATOR,
      tags: [Tags.SPACE, Tags.BUILDING],
      cost: 27,
      productionBox: Units.of({titanium: 1}),
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
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
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

