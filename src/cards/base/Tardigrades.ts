import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {ResourceType} from '../../common/ResourceType';
import {CardName} from '../../common/cards/CardName';
import {IResourceCard} from '../ICard';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';

export class Tardigrades extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TARDIGRADES,
      tags: [Tags.MICROBE],
      cost: 4,

      resourceType: ResourceType.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 4),

      metadata: {
        cardNumber: '049',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.vpText('1 VP per 4 Microbes on this card.');
        }),
      },
    });
  }
  public override resourceCount = 0;

  public play() {
    return undefined;
  }
  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
}
