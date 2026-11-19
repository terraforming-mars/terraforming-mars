import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {MarsBotTurmoilHelper} from '@/server/automa/turmoil/MarsBotTurmoilHelper';

export class GrayEminenceMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B29_GRAY_EMINENCE});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    const turmoil = marsBot.game.turmoil;
    if (turmoil === undefined) {
      marsBot.game.log('MarsBot (${0}): Turmoil not active', (b) => b.cardName(name));
      return false;
    }
    // Up to 2 delegates, each to the party with the fewest MarsBot delegates, then the fewest
    // player delegates, then a random one. 2 M€ for each delegate it can't place.
    for (let i = 0; i < 2; i++) {
      if (!turmoil.delegateReserve.has(marsBot.player)) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (${0}): no delegate in reserve, +2:r:mc:', (b) => b.cardName(name));
        continue;
      }
      const partyName = new MarsBotTurmoilHelper(marsBot.game).selectGrayEminenceParty();
      turmoil.sendDelegateToParty(marsBot.player, partyName, marsBot.game);
      marsBot.game.log('MarsBot (${0}): places a delegate in ${1}', (b) => b.cardName(name).partyName(partyName));
    }
    return false;
  }
}
