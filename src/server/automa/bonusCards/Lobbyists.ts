import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {LobbyistsBase} from '@/server/automa/bonusCards/LobbyistsBase';

export class Lobbyists extends LobbyistsBase {
  constructor() {
    super({id: BonusCardId.B06_LOBBYISTS, name: CardName.AUTOMA_LOBBYISTS});
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
