import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';

export class EconomicEspionage extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ECONOMIC_ESPIONAGE,
      cost: 8,
      tags: [Tags.EARTH],
      resourceType: ResourceType.DATA,

      metadata: {
        cardNumber: 'Pf37',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to add 1 data to ANY card.', (eb) => {
            eb.megacredits(2).startAction.data({amount: 1});
          }).br;
        }),
        description: '1VP for every 3 data here.',
        victoryPoints: CardRenderDynamicVictoryPoints.data(1, 3),
      },
    });
  }

  public resourceCount = 0;

  public canAct(player: Player) {
    return player.canAfford(2);
  }

  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 2, {
      title: 'Select how to pay for action',
      afterPay: () => {
        player.game.defer(new AddResourcesToCard(player, ResourceType.DATA));
      },
    }));
    return undefined;
  }

  public play() {
    return undefined;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 3);
  }
}
