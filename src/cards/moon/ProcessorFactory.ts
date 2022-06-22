import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardResource} from '../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class ProcessorFactory extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PROCESSOR_FACTORY,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 8,

      resourceType: CardResource.DATA,
      victoryPoints: VictoryPoints.resource(1, 3),

      metadata: {
        cardNumber: 'M86',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 Steel to add 2 Data resources to ANY card.', (eb) => eb.startAction.steel(1).arrow().data({amount: 2}).asterix());
          b.br;
          b.vpText('1 VP for every 3 data resources here.');
        }),
      },
    });
  }
  public override resourceCount = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return player.steel > 0;
  }

  public action(player: Player) {
    player.steel--;
    player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 2}));
    return undefined;
  }
}
