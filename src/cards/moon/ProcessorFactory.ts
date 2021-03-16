import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Card} from '../Card';

export class ProcessorFactory extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PROCESSOR_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 8,
      resourceType: ResourceType.DATA,

      metadata: {
        cardNumber: 'M86',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 Steel to add 2 Data resources to any card.', (eb) => eb.startAction.steel(1).arrow().data().data());
          b.br;
          b.vpText('1 VP for every 3 data resources here.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.data(1, 3),
      },
    });
  };
  public resourceCount = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return player.steel > 0;
  }

  public action(player: Player) {
    player.steel--;
    player.game.defer(new AddResourcesToCard(player, ResourceType.DATA, {count: 2}));
    return undefined;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 3);
  }
}
