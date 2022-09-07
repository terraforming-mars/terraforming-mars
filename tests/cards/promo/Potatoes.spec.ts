import {expect} from 'chai';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';
import {Potatoes} from '../../../src/server/cards/promo/Potatoes';
import {Player} from '../../../src/server/Player';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Potatoes', function() {
  let card: Potatoes;
  let player: Player;

  beforeEach(function() {
    card = new Potatoes();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
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
