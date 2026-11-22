import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {LobbyistsBase} from '@/server/automa/bonusCards/LobbyistsBase';

export class DoItRight extends LobbyistsBase {
  constructor() {
    super(BonusCardName.DO_IT_RIGHT);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (this.maybeRaiseTemperature(marsBot) ||
      this.maybePlaceGreeneryAndRaiseOxygen(marsBot) ||
      this.maybePlaceOcean(marsBot)) {
      return false;
    }
    marsBot.game.log('MarsBot (${0}): no effect', (b) => b.bonusCardName(this.name));
    return false;
  }
}
