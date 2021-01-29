import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class CryoSleep extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tags.SCIENCE],
      name: CardName.CRYO_SLEEP,
      cardType: CardType.ACTIVE,

      metadata: {
        cardNumber: 'C07',
        renderData: CardRenderer.builder((b) => b.effect('When you trade, you pay 1 less resource for it.', (be) => {
          be.trade().startEffect.tradeDiscount(1);
        })),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    player.colonyTradeDiscount++;
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }

  public onDiscard(player: Player): void {
    player.colonyTradeDiscount--;
  }
}
