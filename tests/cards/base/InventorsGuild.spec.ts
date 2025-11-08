import {expect} from 'chai';
import {churn, cast} from '../../TestingUtils';
import {InventorsGuild} from '../../../src/server/cards/base/InventorsGuild';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('InventorsGuild', () => {
  let card: InventorsGuild;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new InventorsGuild();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act', () => {
    player.megaCredits = 3;
    const selectCard = cast(churn(card.action(player), player), SelectCard);
    selectCard.cb([]);

    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    player.megaCredits = 3;

    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Cannot buy card if cannot pay', () => {
    player.megaCredits = 2;
    const selectCard = cast(churn(card.action(player), player), SelectCard);
    expect(selectCard.config.max).to.eq(0);
    selectCard.cb([]);
    expect(game.deferredActions).has.lengthOf(0);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });
});
