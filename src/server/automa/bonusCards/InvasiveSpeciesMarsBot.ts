import {BonusCardId} from '@/common/automa/AutomaTypes';
import {ColonyName} from '@/common/colonies/ColonyName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {maybeRemoveAnimalOrMicrobe} from '@/server/automa/bonusCards/bonusCardHelpers';

export class InvasiveSpeciesMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B02_INVASIVE_SPECIES});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    maybeRemoveAnimalOrMicrobe(marsBot, name);
    // a. With Venus Next or Colonies, MarsBot gains 2 M€ and 1 floater; b. otherwise 5 M€
    const opts = marsBot.game.gameOptions;
    if (opts.venusNextExtension || opts.coloniesExtension) {
      marsBot.gainMc(2);
      // Without Venus Next the floater goes to Titan's storage area, and nowhere when Titan isn't in play (C-13, C-14)
      if (opts.venusNextExtension) {
        marsBot.addFloaters(1);
        marsBot.game.log('MarsBot (${0}): +1 floater', (b) => b.cardName(name));
      } else if (marsBot.game.colonies.some((colony) => colony.name === ColonyName.TITAN)) {
        marsBot.addFloaters(1);
        marsBot.game.log('MarsBot (${0}): +1 floater in Titan storage', (b) => b.cardName(name));
      }
      marsBot.game.log('MarsBot (${0}): +2:r:mc:', (b) => b.cardName(name));
    } else {
      marsBot.gainMc(5);
      marsBot.game.log('MarsBot (${0}): +5:r:mc:', (b) => b.cardName(name));
    }
    // The card is never destroyed
    return false;
  }
}
