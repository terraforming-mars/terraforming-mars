import {expect} from 'chai';
import {SolarLogistics} from '../../../src/server/cards/promo/SolarLogistics';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';

describe('Solar Logistics', function() {
  let card: SolarLogistics;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new SolarLogistics();
    [/* game */, player, player2] = testGame(2);
  });

  it('Card Effects Work - titanium', function() {
    player.titanium = 0;
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.titanium).to.eq(2);
  });

  it('Card Effects Work - discounts', function() {
    card.play(player);
    expect(card.getCardDiscount(player, new Cartel())).to.eq(2);
    expect(card.getCardDiscount(player, new Birds())).to.eq(0);
    expect(card.getCardDiscount(player, new LunaGovernor())).to.eq(4);
  });

  it('Card Effects Work - card draw', function() {
    card.play(player);
    expect(player.cardsInHand.length).to.eq(0);
    expect(card.onCardPlayedFromAnyPlayer(player, player, card)).is.undefined;
    // I play space event
    expect(card.onCardPlayedFromAnyPlayer(player, player, new BigAsteroid())).is.undefined;
    expect(player.cardsInHand.length).to.eq(1);
    // Other player plays space event
    expect(card.onCardPlayedFromAnyPlayer(player, player2, new BigAsteroid())).is.undefined;
    expect(player.cardsInHand.length).to.eq(2);
  });
});
