import {BonusCardId} from '@/common/automa/AutomaTypes';
import {ColonyName} from '@/common/colonies/ColonyName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {maybeRemoveAnimalOrMicrobe} from '@/server/automa/bonusCards/bonusCardHelpers';

export class InvasiveSpeciesMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B02_INVASIVE_SPECIES});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    maybeRemoveAnimalOrMicrobe(marsBot, this.name);
    // a. With Venus Next or Colonies, MarsBot gains 2 M€ and 1 floater; b. otherwise 5 M€
    const expansions = marsBot.game.gameOptions.expansions;
    if (expansions.venus || expansions.colonies) {
      marsBot.gainMc(2);
      // Without Venus Next the floater goes to Titan's storage area, and nowhere when Titan isn't in play (C-13, C-14)
      if (expansions.venus) {
        marsBot.addFloaters(1);
        marsBot.game.log('MarsBot (${0}): +1 floater', (b) => b.cardName(this.name));
      } else if (marsBot.game.colonies.some((colony) => colony.name === ColonyName.TITAN)) {
        marsBot.addFloaters(1);
        marsBot.game.log('MarsBot (${0}): +1 floater in Titan storage', (b) => b.cardName(this.name));
      }
      marsBot.game.log('MarsBot (${0}): +2:r:mc:', (b) => b.cardName(this.name));
    } else {
      marsBot.gainMc(5);
      marsBot.game.log('MarsBot (${0}): +5:r:mc:', (b) => b.cardName(this.name));
    }
    // The card is never destroyed
    return false;
  }
}
