import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class ShippingLinesMarsBot extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B19_SHIPPING_LINES, name: CardName.AUTOMA_SHIPPING_LINES});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    marsBot.maybeTrade(this.name);
    return false;
  }
}
