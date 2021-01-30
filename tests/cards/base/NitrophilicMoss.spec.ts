import {expect} from 'chai';
import {NitrophilicMoss} from '../../../src/cards/base/NitrophilicMoss';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {Manutech} from '../../../src/cards/venusNext/Manutech';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {maxOutOceans, TestPlayers} from '../../TestingUtils';

describe('NitrophilicMoss', function() {
  let card : NitrophilicMoss; let player : Player;

  beforeEach(function() {
    card = new NitrophilicMoss();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without enough oceans', function() {
    maxOutOceans(player, 2);
    player.plants = 2;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play if not enough plants', function() {
    maxOutOceans(player, 3);
    player.plants = 1;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    player.plants = 2;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.plants).to.eq(0);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });

  it('Can play with 1 plant if have Viral Enhancers', function() {
    // setup player with viral enhancers in play and 1 plant
    const viralEnhancers = new ViralEnhancers();
    player.playedCards.push(viralEnhancers);
    maxOutOceans(player, 3);
    player.plants = 1;

    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.plants).to.eq(-1);
    viralEnhancers.onCardPlayed(player, card);
    expect(player.plants).to.eq(0);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    player.corporationCard = new Manutech();
    expect(card.canPlay(player)).is.true;
  });
});
