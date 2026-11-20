import {GlobalParameter} from '@/common/GlobalParameter';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {LobbyistsBase} from '@/server/automa/bonusCards/LobbyistsBase';

export class LobbyistsVenusMarsBot extends LobbyistsBase {
  constructor() {
    super({id: BonusCardId.B15_LOBBYISTS_VENUS, name: CardName.AUTOMA_LOBBYISTS_VENUS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (this.maybeRaiseTemperature(marsBot) || this.maybePlaceGreeneryAndRaiseOxygen(marsBot)) {
      return this.logDestroyed(marsBot);
    }

    // Unlike the temperature and oxygen checks, the Venus one keeps the card
    if (this.isNearBonusStep(marsBot.game, 'venus')) {
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
