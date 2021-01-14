import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class RimFreighters implements IProjectCard {
    public cost = 4;
    public tags = [Tags.SPACE];
    public name = CardName.RIM_FREIGHTERS;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
      player.colonyTradeDiscount++;
      return undefined;
    }

    public onDiscard(player: Player): void {
      player.colonyTradeDiscount--;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C35',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you trade, you pay 1 less resource for it.', (eb) => {
          eb.trade().startEffect.tradeDiscount(1);
        });
      }),
    }
}
