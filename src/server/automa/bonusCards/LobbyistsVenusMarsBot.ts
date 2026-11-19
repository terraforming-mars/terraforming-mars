import {GlobalParameter} from '@/common/GlobalParameter';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {isNearBonusStep, lobbyistsOxygenBranch, lobbyistsTempBranch} from '@/server/automa/bonusCards/bonusCardHelpers';

export class LobbyistsVenusMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B15_LOBBYISTS_VENUS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (lobbyistsTempBranch(marsBot, this.name) || lobbyistsOxygenBranch(marsBot, this.name)) {
      return true;
    }

    // Unlike the temperature and oxygen branches, the Venus branch keeps the card
    if (isNearBonusStep(marsBot.game, 'venus')) {
      // Pristar's cube cancels only the first of the 2 steps
      const steps = marsBot.interceptsParameterRaise(GlobalParameter.VENUS) ? 1 : 2;
      marsBot.game.increaseVenusScaleLevel(marsBot.player, steps);
      marsBot.game.log('MarsBot (${0}): raises Venus ${1} step(s)', (b) => b.cardName(this.name).number(steps));
      return false;
    }

    marsBot.advanceFurthestParameter(this.name);
    return false;
  }
}
