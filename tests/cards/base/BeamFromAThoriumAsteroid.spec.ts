import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {BeamFromAThoriumAsteroid} from '../../../src/server/cards/base/BeamFromAThoriumAsteroid';

describe('BeamFromAThoriumAsteroid', function() {
  let card: BeamFromAThoriumAsteroid;
  let player: TestPlayer;

  beforeEach(function() {
    card = new BeamFromAThoriumAsteroid();
    [/* game */, player] = testGame(1);
  });

  it('Cannot play without a Jovian tag', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.heat).to.eq(3);
    expect(player.production.energy).to.eq(3);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
