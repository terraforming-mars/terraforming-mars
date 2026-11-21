import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class GovernmentIntervention extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B16_GOVERNMENT_INTERVENTION, name: CardName.AUTOMA_GOVERNMENT_INTERVENTION});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const venus = marsBot.game.getVenusScaleLevel();
    const isEvenGen = marsBot.game.generation % 2 === 0;
    const venusComplete = venus >= marsBot.game.max.venus;

    // Only the first effect that is possible is evaluated: with every Martian parameter at its
    // maximum, an even generation falls through to raising Venus (rulebook C, p.3)
    let advanced = false;
    if (isEvenGen || venusComplete) {
      marsBot.withoutTRorMcGain(() => {
        advanced = marsBot.advanceFurthestParameter(this.name, false);
      });
    }
    if (!advanced && venus < marsBot.game.max.venus) {
      // FAQ (rulebook B, p.4): Aphrodite's 2 M€ per Venus step still applies, and raising
      // Venus pays MarsBot no other M€, so the 8% bonus pays nothing, nor does the colony Amazonis
      // Planitia prints at 16%.
      marsBot.withoutTRGain(() => {
        marsBot.bonusMcBlocked = true;
        marsBot.game.increaseVenusScaleLevel(marsBot.player, 1);
        marsBot.bonusMcBlocked = false;
      });
    }
    return false;
  }
}
