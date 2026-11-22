import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {LobbyistsBase} from '@/server/automa/bonusCards/LobbyistsBase';

export class Lobbyists extends LobbyistsBase {
  constructor() {
    super(BonusCardName.LOBBYISTS);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (this.maybeRaiseTemperature(marsBot) ||
      this.maybePlaceGreeneryAndRaiseOxygen(marsBot) ||
      this.maybePlaceOcean(marsBot)) {
      return this.logDestroyed(marsBot);
    }
    marsBot.advanceFurthestParameter(this.name);
    return false;
  }
}
