import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class VenusianInsects extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_INSECTS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.MICROBE],
      cost: 5,
      resourceType: ResourceType.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 2),

      requirements: CardRequirements.builder((b) => b.venus(12)),
      metadata: {
        cardNumber: '260',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb)=> {
            eb.empty().startAction.microbes(1);
          }).br;
          b.vpText('1 VP for every 2nd Microbe on this card.');
        }),
        description: 'Requires Venus 12%.',
      },
    });
  };
  public override resourceCount: number = 0;

  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
