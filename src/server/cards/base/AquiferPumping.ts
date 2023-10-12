import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {TITLES} from '../../inputs/titles';

export const OCEAN_COST = 8;
export class AquiferPumping extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.AQUIFER_PUMPING,
      tags: [Tag.BUILDING],
      cost: 18,

      metadata: {
        cardNumber: '187',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 8 M€ to place 1 ocean tile. STEEL MAY BE USED as if you were playing a building card.', (eb) => eb.megacredits(8).openBrackets.steel(1).closeBrackets.startAction.oceans(1));
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.canAfford({cost: OCEAN_COST, steel: true, tr: {oceans: 1}});
  }
  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 8, {canUseSteel: true, title: TITLES.payForCardAction(this.name)}))
      .andThen(() => player.game.defer(new PlaceOceanTile(player)));
    return undefined;
  }
}
