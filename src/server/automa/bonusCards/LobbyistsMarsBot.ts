import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {advanceFurthestParameter, lobbyistsOceanBranch, lobbyistsOxygenBranch, lobbyistsTempBranch} from '@/server/automa/bonusCards/bonusCardHelpers';

export class LobbyistsMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B06_LOBBYISTS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    // The first three branches destroy the card, the last one keeps it
    if (lobbyistsTempBranch(marsBot, name) ||
      lobbyistsOxygenBranch(marsBot, name) ||
      lobbyistsOceanBranch(marsBot, name)) {
      return true;
    }
    advanceFurthestParameter(marsBot, name);
    return false;
  }
}
