import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {advanceFurthestParameter, withoutTRGain, withoutTRorMcGain} from '@/server/automa/bonusCards/bonusCardHelpers';

export class GovernmentInterventionMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B16_GOVERNMENT_INTERVENTION});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    const venus = marsBot.game.getVenusScaleLevel();
    const isEvenGen = marsBot.game.generation % 2 === 0;
    const venusComplete = venus >= marsBot.game.max.venus;

    // Only the first effect that is possible is evaluated: with every Martian parameter at its
    // maximum, an even generation falls through to raising Venus (rulebook C, p.3)
    let advanced = false;
    if (isEvenGen || venusComplete) {
      withoutTRorMcGain(marsBot, () => {
        advanced = advanceFurthestParameter(marsBot, name, false);
      });
    }
    if (!advanced && venus < marsBot.game.max.venus) {
      // FAQ (rulebook B, p.4): Aphrodite's 2 M€ per Venus step still applies, and raising
      // Venus pays MarsBot no other M€, so the 8% bonus pays nothing, nor does the colony Amazonis
      // Planitia prints at 16%.
      withoutTRGain(marsBot, () => {
        marsBot.bonusMcBlocked = true;
        try {
          marsBot.game.increaseVenusScaleLevel(marsBot.player, 1);
        } finally {
          marsBot.bonusMcBlocked = false;
        }
      });
    }
    return false;
  }
}
