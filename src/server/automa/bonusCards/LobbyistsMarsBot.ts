import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {LobbyistsBase} from '@/server/automa/bonusCards/LobbyistsBase';

export class LobbyistsMarsBot extends LobbyistsBase {
  constructor() {
    super({id: BonusCardId.B06_LOBBYISTS});
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
