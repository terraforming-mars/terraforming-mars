import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {lobbyistsOceanBranch, lobbyistsOxygenBranch, lobbyistsTempBranch} from '@/server/automa/bonusCards/bonusCardHelpers';

export class DoItRightMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B25_DO_IT_RIGHT});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    if (lobbyistsTempBranch(marsBot, name) ||
      lobbyistsOxygenBranch(marsBot, name) ||
      lobbyistsOceanBranch(marsBot, name)) {
      return false;
    }
    marsBot.game.log('MarsBot (${0}): no effect', (b) => b.cardName(name));
    return false;
  }
}
