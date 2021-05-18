import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {IActionCard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Resources} from '../../Resources';

export class RustEatingBacteria extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.RUST_EATING_BACTERIA,
      cardType: CardType.ACTIVE,
      tags: [Tags.MICROBE],
      cost: 7,
      resourceType: ResourceType.MICROBE,

      metadata: {
        cardNumber: 'M88',
        victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 3),
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel to add 2 Microbes here.', (eb) => {
            eb.startAction.steel(1).arrow().microbes(2);
          }).br;
          b.vpText('1 VP per 3 Microbes here.');
        }),
      },
    });
  };

  public resourceCount = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return player.steel >= 1;
  }

  public action(player: Player) {
    player.deductResource(Resources.STEEL, 1);
    player.addResourceTo(this, 2);
    return undefined;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 3);
  }
}
