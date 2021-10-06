import {expect} from 'chai';
import {BeamFromAThoriumAsteroid} from '../../../src/cards/base/BeamFromAThoriumAsteroid';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('BeamFromAThoriumAsteroid', function() {
  let card : BeamFromAThoriumAsteroid; let player : TestPlayer;

  beforeEach(function() {
    card = new BeamFromAThoriumAsteroid();
    player = TestPlayers.BLUE.newPlayer();
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

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
