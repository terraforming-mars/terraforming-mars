import { IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {Resource} from '../../../common/Resource';
import {TITLES} from '../../inputs/titles';

const ACTION_COST = 8;

export class UndergroundDetonations extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.UNDERGROUND_DETONATIONS,
      tags: [Tag.BUILDING],
      cost: 2,

      metadata: {
        cardNumber: '202',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 8M€ to increase your heat production 2 steps. STEEL MAY BE USED as if playing a building card.', (eb) => {
            eb.megacredits(8).super((b) => b.steel(2)).startAction.production((pb)=>pb.heat(2));
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.canAfford({cost: ACTION_COST, steel: true});
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, ACTION_COST, {canUseSteel: true, title: TITLES.payForCardAction(this.name)}))
      .andThen(() => player.production.add(Resource.HEAT, 2, {log: true}));
    return undefined;
  }
}
