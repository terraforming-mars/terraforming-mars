import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {Resources} from '../../../common/Resources';

export class RustEatingBacteria extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.RUST_EATING_BACTERIA,
      cardType: CardType.ACTIVE,
      tags: [Tag.MICROBE],
      cost: 7,

      resourceType: CardResource.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 3),

      metadata: {
        cardNumber: 'M88',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel to add 2 Microbes here.', (eb) => {
            eb.startAction.steel(1).arrow().microbes(2);
          }).br;
          b.vpText('1 VP per 3 Microbes here.');
        }),
      },
    });
  }


  public canAct(player: Player) {
    return player.steel >= 1;
  }

  public action(player: Player) {
    player.deductResource(Resources.STEEL, 1);
    player.addResourceTo(this, 2);
    return undefined;
  }
}
