import {expect} from 'chai';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';
import {Potatoes} from '../../../src/server/cards/promo/Potatoes';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Potatoes', function() {
  let card: Potatoes;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Potatoes();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', function() {
    player.plants = 1;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play with 1 plant if have Viral Enhancers', function() {
    player.plants = 1;
    player.playedCards.push(new ViralEnhancers());
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    player.plants = 2;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.plants).to.eq(0);
    expect(player.production.megacredits).to.eq(2);
  });
});
