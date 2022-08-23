import {expect} from 'chai';
import {Moss} from '../../../src/server/cards/base/Moss';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Moss', function() {
  let card: Moss;
  let player: Player;

  beforeEach(function() {
    card = new Moss();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without enough oceans', function() {
    maxOutOceans(player, 2);
    player.plants = 1;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if have no plants', function() {
    maxOutOceans(player, 3);
    player.plants = 0;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    player.plants = 1;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.plants).to.eq(0);
    expect(player.production.plants).to.eq(1);
  });

  it('Can play with 0 plants if have Viral Enhancers', function() {
    maxOutOceans(player, 3);
    const viralEnhancers = new ViralEnhancers();
    player.playedCards.push(viralEnhancers);
    player.plants = 0;

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.plants).to.eq(-1);
    viralEnhancers.onCardPlayed(player, card);
    expect(player.plants).to.eq(0);
    expect(player.production.plants).to.eq(1);
  });
});
