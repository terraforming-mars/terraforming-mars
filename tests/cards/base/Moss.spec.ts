import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Moss} from '../../../src/server/cards/base/Moss';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Moss', function() {
  let card: Moss;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Moss();
    [/* game */, player] = testGame(2);
  });

  it('Can not play without enough oceans', function() {
    maxOutOceans(player, 2);
    player.stock.plants = 1;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if have no plants', function() {
    maxOutOceans(player, 3);
    player.stock.plants = 0;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    player.stock.plants = 1;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.stock.plants).to.eq(0);
    expect(player.production.plants).to.eq(1);
  });

  it('Can play with 0 plants if have Viral Enhancers', function() {
    maxOutOceans(player, 3);
    const viralEnhancers = new ViralEnhancers();
    player.playedCards.push(viralEnhancers);
    player.stock.plants = 0;

    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.stock.plants).to.eq(-1);
    viralEnhancers.onCardPlayed(player, card);
    expect(player.stock.plants).to.eq(0);
    expect(player.production.plants).to.eq(1);
  });
});
