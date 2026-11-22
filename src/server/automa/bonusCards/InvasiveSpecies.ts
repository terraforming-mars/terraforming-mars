import {ColonyName} from '@/common/colonies/ColonyName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {maybeRemoveAnimalOrMicrobe} from '@/server/automa/bonusCards/bonusCardHelpers';

export class InvasiveSpecies extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.INVASIVE_SPECIES);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    maybeRemoveAnimalOrMicrobe(marsBot, this.name);
    // a. With Venus Next or Colonies, MarsBot gains 2 M€ and 1 floater; b. otherwise 5 M€
    const expansions = marsBot.game.gameOptions.expansions;
    if (expansions.venus || expansions.colonies) {
      marsBot.gainMc(2);
      // Without Venus Next the floater goes to Titan's storage area, and nowhere when Titan isn't in play (rulebook C, p.4)
      if (expansions.venus) {
        marsBot.addFloaters(1);
        marsBot.game.log('MarsBot (${0}): +1 floater', (b) => b.bonusCardName(this.name));
      } else if (marsBot.game.colonies.some((colony) => colony.name === ColonyName.TITAN)) {
        marsBot.addFloaters(1);
        marsBot.game.log('MarsBot (${0}): +1 floater in Titan storage', (b) => b.bonusCardName(this.name));
      }
      marsBot.game.log('MarsBot (${0}): +2:r:mc:', (b) => b.bonusCardName(this.name));
    } else {
      marsBot.gainMc(5);
      marsBot.game.log('MarsBot (${0}): +5:r:mc:', (b) => b.bonusCardName(this.name));
    }
    return false;
  }
}
