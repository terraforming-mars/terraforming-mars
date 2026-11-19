import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {lobbyistsOceanBranch, lobbyistsOxygenBranch, lobbyistsTempBranch} from '@/server/automa/bonusCards/bonusCardHelpers';

export class LobbyistsMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B06_LOBBYISTS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // The first three branches destroy the card, the last one keeps it
    if (lobbyistsTempBranch(marsBot, this.name) ||
      lobbyistsOxygenBranch(marsBot, this.name) ||
      lobbyistsOceanBranch(marsBot, this.name)) {
      return true;
    }
    marsBot.advanceFurthestParameter(this.name);
    return false;
  }
}
