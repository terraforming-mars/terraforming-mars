import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {MarsBotTurmoilHelper} from '@/server/automa/turmoil/MarsBotTurmoilHelper';
import {Turmoil} from '@/server/turmoil/Turmoil';

export class PartyPolitics extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.PARTY_POLITICS);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const turmoil = Turmoil.getTurmoil(marsBot.game);
    // Place 1 delegate from reserve using the priority list (rulebook C, p.6)
    const placed = new MarsBotTurmoilHelper(marsBot.game).maybePlaceDelegate();
    if (placed === undefined) {
      marsBot.game.log('MarsBot (${0}): no delegates in reserve', (b) => b.bonusCardName(this.name));
      return false;
    }

    // With a delegate still in reserve and at least 5 M€, MarsBot reveals the top card of the
    // project deck to read its cost, then discards it. A cost divisible by 3 spends 5 M€ on a second
    // delegate.
    if (turmoil.delegateReserve.has(marsBot.player) && marsBot.megacredits >= 5) {
      const revealedCard = marsBot.game.projectDeck.draw(marsBot.game);
      if (revealedCard !== undefined) {
        marsBot.game.log('MarsBot (${0}): reveals ${1} (cost ${2})', (b) => b.bonusCardName(this.name).card(revealedCard).number(revealedCard.cost));
        marsBot.game.projectDeck.discardPile.push(revealedCard);
        if (revealedCard.cost % 3 === 0) {
          marsBot.loseMc(5);
          marsBot.game.log('MarsBot (${0}): spends 5:r:mc: to place a second delegate', (b) => b.bonusCardName(this.name));
          new MarsBotTurmoilHelper(marsBot.game).maybePlaceDelegate();
        }
      }
    }
    return false;
  }
}
