import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class TradeEnvoys implements IProjectCard {
    public cost = 6;
    public tags = [];
    public name = CardName.TRADE_ENVOYS;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
      player.colonyTradeOffset++;
      return undefined;
    }

    public onDiscard(player: Player): void {
      player.colonyTradeOffset--;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C46',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you trade, you may first increase that Colony Tile track 1 step.', (eb) => {
          eb.trade().startEffect.text('+1', CardRenderItemSize.LARGE);
        });
      }),
    }
}
