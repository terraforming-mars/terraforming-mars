import {expect} from 'chai';
import {Moss} from '../../../src/cards/base/Moss';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Moss', function() {
  let card : Moss; let player : Player;

  beforeEach(function() {
    card = new Moss();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without enough oceans', function() {
    TestingUtils.maxOutOceans(player, 2);
    player.plants = 1;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if have no plants', function() {
    TestingUtils.maxOutOceans(player, 3);
    player.plants = 0;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 3);
    player.plants = 1;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.plants).to.eq(0);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });

  it('Can play with 0 plants if have Viral Enhancers', function() {
    TestingUtils.maxOutOceans(player, 3);
    const viralEnhancers = new ViralEnhancers();
    player.playedCards.push(viralEnhancers);
    player.plants = 0;

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.plants).to.eq(-1);
    viralEnhancers.onCardPlayed(player, card);
    expect(player.plants).to.eq(0);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
