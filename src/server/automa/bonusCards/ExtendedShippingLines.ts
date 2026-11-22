import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class ExtendedShippingLines extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.EXTENDED_SHIPPING_LINES);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    marsBot.maybeTrade(this.name);
    return false;
  }
}
