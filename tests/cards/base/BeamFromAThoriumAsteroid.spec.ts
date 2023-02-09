import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {BeamFromAThoriumAsteroid} from '../../../src/server/cards/base/BeamFromAThoriumAsteroid';

describe('BeamFromAThoriumAsteroid', function() {
  let card: BeamFromAThoriumAsteroid;
  let player: TestPlayer;

  beforeEach(function() {
    card = new BeamFromAThoriumAsteroid();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Cannot play without a Jovian tag', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.heat).to.eq(3);
    expect(player.production.energy).to.eq(3);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
