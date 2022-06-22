import {expect} from 'chai';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {Potatoes} from '../../../src/cards/promo/Potatoes';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Potatoes', function() {
  let card : Potatoes; let player : Player;

  beforeEach(function() {
    card = new Potatoes();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
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
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
