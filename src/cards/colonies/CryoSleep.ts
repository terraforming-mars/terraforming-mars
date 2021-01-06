import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class CryoSleep implements IProjectCard {
  public cost = 10;
  public tags = [Tags.SCIENCE];
  public name = CardName.CRYO_SLEEP;
  public cardType = CardType.ACTIVE;

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

  public metadata: CardMetadata = {
    cardNumber: 'C07',
    renderData: CardRenderer.builder((b) => b.effect('When you trade, you pay 1 less resource for it.', (be) => {
      be.trade().startEffect.tradeDiscount(1);
    })),
    victoryPoints: 1,
  };
}
