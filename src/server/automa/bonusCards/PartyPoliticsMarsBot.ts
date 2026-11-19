import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {MarsBotTurmoilHelper} from '@/server/automa/turmoil/MarsBotTurmoilHelper';

export class PartyPoliticsMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B21_PARTY_POLITICS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    const turmoil = marsBot.game.turmoil;
    if (turmoil === undefined) {
      marsBot.game.log('MarsBot (${0}): Turmoil not active', (b) => b.cardName(name));
      return false;
    }
    // T-7: Place 1 delegate from reserve using the priority list
    const placed = new MarsBotTurmoilHelper(marsBot.game).maybePlaceDelegate();
    if (placed === undefined) {
      marsBot.game.log('MarsBot (${0}): no delegates in reserve', (b) => b.cardName(name));
      return false;
    }

    // T-8: with a delegate still in reserve and at least 5 M€, MarsBot flips a project card.
    // A cost divisible by 3 spends 5 M€ on a second delegate.
    if (turmoil.delegateReserve.has(marsBot.player) && marsBot.megacredits >= 5) {
      const flipped = marsBot.game.projectDeck.draw(marsBot.game);
      if (flipped !== undefined) {
        marsBot.game.log('MarsBot (${0}): flips ${1} (cost ${2})', (b) => b.cardName(name).card(flipped).number(flipped.cost));
        marsBot.game.projectDeck.discardPile.push(flipped);
        if (flipped.cost % 3 === 0) {
          marsBot.megacredits -= 5;
          marsBot.game.log('MarsBot (${0}): spends 5:r:mc: to place a second delegate', (b) => b.cardName(name));
          new MarsBotTurmoilHelper(marsBot.game).maybePlaceDelegate();
        }
      }
    }
    return false;
  }
}
