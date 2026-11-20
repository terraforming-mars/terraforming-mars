import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {LobbyistsBase} from '@/server/automa/bonusCards/LobbyistsBase';

export class DoItRightMarsBot extends LobbyistsBase {
  constructor() {
    super({id: BonusCardId.B25_DO_IT_RIGHT, name: CardName.AUTOMA_DO_IT_RIGHT});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (this.maybeRaiseTemperature(marsBot) ||
      this.maybePlaceGreeneryAndRaiseOxygen(marsBot) ||
      this.maybePlaceOcean(marsBot)) {
      return false;
    }
    marsBot.game.log('MarsBot (${0}): no effect', (b) => b.cardName(this.name));
    return false;
  }
}
