import {expect} from 'chai';
import {Fish} from '../../../src/cards/base/Fish';
import {LocalHeatTrapping} from '../../../src/cards/base/LocalHeatTrapping';
import {Pets} from '../../../src/cards/base/Pets';
import {Helion} from '../../../src/cards/corporation/Helion';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('LocalHeatTrapping', function() {
  let card : LocalHeatTrapping; let player : Player;

  beforeEach(function() {
    card = new LocalHeatTrapping();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without 5 heat', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - no animal targets', function() {
    player.heat = 5;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    player.playedCards.push(card);
    expect(player.plants).to.eq(4);
    expect(player.heat).to.eq(0);
  });

  it('Should play - single animal target', function() {
    player.heat = 5;
    const pets = new Pets();
    player.playedCards.push(card, pets);

    const orOptions = card.play(player) as OrOptions;
    expect(orOptions).is.not.undefined;
    expect(orOptions instanceof OrOptions).is.true;

    orOptions.options[0].cb();
    expect(player.plants).to.eq(4);
    expect(player.heat).to.eq(0);

    orOptions.options[1].cb();
    expect(player.getResourcesOnCard(pets)).to.eq(2);
  });

  it('Should play - multiple animal targets', function() {
    player.heat = 5;
    const pets = new Pets();
    const fish = new Fish();
    player.playedCards.push(card, pets, fish);

    const orOptions = card.play(player) as OrOptions;
    expect(player.heat).to.eq(0);
    orOptions.options[1].cb([fish]);
    expect(player.getResourcesOnCard(fish)).to.eq(2);
  });

  it('Can\'t play as Helion if not enough heat left after paying for card', function() {
    const corp = new Helion();
    corp.play(player);
    player.corporationCard = corp;

    player.megaCredits = 0;
    player.heat = 5; // have to pay for card with 1 heat
    expect(card.canPlay(player)).is.not.true;
  });
});
