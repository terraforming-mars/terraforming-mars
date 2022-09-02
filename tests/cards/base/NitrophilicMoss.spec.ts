import {expect} from 'chai';
import {NitrophilicMoss} from '../../../src/server/cards/base/NitrophilicMoss';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';
import {Manutech} from '../../../src/server/cards/venusNext/Manutech';
import {Game} from '../../../src/server/Game';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('NitrophilicMoss', function() {
  let card: NitrophilicMoss;
  let player: TestPlayer;

  beforeEach(function() {
    card = new NitrophilicMoss();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without enough oceans', function() {
    maxOutOceans(player, 2);
    player.plants = 2;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if not enough plants', function() {
    maxOutOceans(player, 3);
    player.plants = 1;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    player.plants = 2;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.plants).to.eq(0);
    expect(player.production.plants).to.eq(2);
  });

  it('Can play with 1 plant if have Viral Enhancers', function() {
    // setup player with viral enhancers in play and 1 plant
    const viralEnhancers = new ViralEnhancers();
    player.playedCards.push(viralEnhancers);
    maxOutOceans(player, 3);
    player.plants = 1;

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.plants).to.eq(-1);
    viralEnhancers.onCardPlayed(player, card);
    expect(player.plants).to.eq(0);
    expect(player.production.plants).to.eq(2);
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    player.setCorporationForTest(new Manutech());
    expect(player.canPlayIgnoringCost(card)).is.true;
  });
});
