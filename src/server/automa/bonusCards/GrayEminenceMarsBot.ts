import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotTurmoilHelper} from '@/server/automa/turmoil/MarsBotTurmoilHelper';
import {Turmoil} from '@/server/turmoil/Turmoil';

export class GrayEminenceMarsBot extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B29_GRAY_EMINENCE, name: CardName.AUTOMA_GRAY_EMINENCE});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const turmoil = Turmoil.getTurmoil(marsBot.game);
    // Up to 2 delegates, each to the party with the fewest MarsBot delegates, then the fewest
    // player delegates, then a random one. 2 M€ for each delegate it can't place.
    for (let i = 0; i < 2; i++) {
      if (!turmoil.delegateReserve.has(marsBot.player)) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (${0}): no delegate in reserve, +2:r:mc:', (b) => b.cardName(this.name));
        continue;
      }
      const partyName = new MarsBotTurmoilHelper(marsBot.game).selectGrayEminenceParty();
      turmoil.sendDelegateToParty(marsBot.player, partyName, marsBot.game);
      marsBot.game.log('MarsBot (${0}): places a delegate in ${1}', (b) => b.cardName(this.name).partyName(partyName));
    }
    return false;
  }
}
