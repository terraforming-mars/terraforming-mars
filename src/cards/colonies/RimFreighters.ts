import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class RimFreighters extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 4,
      tags: [Tags.SPACE],
      name: CardName.RIM_FREIGHTERS,
      cardType: CardType.ACTIVE,

      metadata: {
        cardNumber: 'C35',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, you pay 1 less resource for it.', (eb) => {
            eb.trade().startEffect.tradeDiscount(1);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.colonyTradeDiscount++;
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.colonyTradeDiscount--;
  }
}
