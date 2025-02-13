import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {churn, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('BusinessNetwork', () => {
  let card: BusinessNetwork;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BusinessNetwork();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
  });

  it('Can not play', () => {
    player.production.add(Resource.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can act', () => {
    expect(card.canAct(player)).is.true;
  });

  it('Cannot buy card if cannot pay', () => {
    player.megaCredits = 2;
    const selectCard = cast(churn(card.action(player), player), SelectCard);
    expect(selectCard.config.max).to.eq(0);

    selectCard.cb([]);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });

  it('Should action as not helion', () => {
    player.megaCredits = 3;
    const selectCard = cast(churn(card.action(player), player), SelectCard);
    selectCard.cb([]);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);

    player.megaCredits = 3;
    selectCard.cb([selectCard.cards[0]]);
    expect(game.deferredActions).has.lengthOf(1);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
