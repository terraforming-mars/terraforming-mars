import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class CryoSleep extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tags.SCIENCE],
      name: CardName.CRYO_SLEEP,
      cardType: CardType.ACTIVE,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C07',
        renderData: CardRenderer.builder((b) => b.effect('When you trade, you pay 1 less resource for it.', (be) => {
          be.trade().startEffect.tradeDiscount(1);
        })),
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
