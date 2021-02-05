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

export class RustEatingBacteria extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.RUST_EATING_BACTERIA,
      cardType: CardType.ACTIVE,
      tags: [Tags.MICROBE],
      cost: 7,
      resourceType: ResourceType.MICROBE,

      metadata: {
        description: '1 VP per each 3 Microbes here.',
        cardNumber: 'M88',
        victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 3),
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 Steel to add 2 Microbes here.', (eb) => {
            eb.startAction.steel(1).arrow().microbes(2);
          });
        }),
      },
    });
  };

  public resourceCount = 0;

  public canPlay(): boolean {
    return true;
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return player.steel >= 1;
  }

  public action(player: Player) {
    player.steel -= 1;
    this.resourceCount += 2;
    return undefined;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 3);
  }
}
