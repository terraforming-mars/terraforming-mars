import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {churnAction, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('BusinessNetwork', function() {
  let card: BusinessNetwork;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BusinessNetwork();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
  });

  it('Can not play', function() {
    player.production.add(Resource.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Cannot buy card if cannot pay', function() {
    player.stock.megacredits = 2;
    const selectCard = cast(churnAction(card, player), SelectCard);
    expect(selectCard.config.max).to.eq(0);

    selectCard.cb([]);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.stock.megacredits).to.eq(2);
  });

  it('Should action as not helion', function() {
    player.stock.megacredits = 3;
    const selectCard = cast(churnAction(card, player), SelectCard);
    selectCard.cb([]);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.stock.megacredits).to.eq(3);

    player.stock.megacredits = 3;
    selectCard.cb([selectCard.cards[0]]);
    expect(game.deferredActions).has.lengthOf(1);
    game.deferredActions.runNext();
    expect(player.stock.megacredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
