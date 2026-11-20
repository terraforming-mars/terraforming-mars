import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';

export class ShippingLinesMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B19_SHIPPING_LINES});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    marsBot.maybeTrade(this.name);
    return false;
  }
}
