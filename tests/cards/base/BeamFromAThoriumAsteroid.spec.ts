import {expect} from 'chai';
import {BeamFromAThoriumAsteroid} from '../../../src/server/cards/base/BeamFromAThoriumAsteroid';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('BeamFromAThoriumAsteroid', function() {
  let card: BeamFromAThoriumAsteroid;
  let player: TestPlayer;

  beforeEach(function() {
    card = new BeamFromAThoriumAsteroid();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Cannot play without a Jovian tag', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
