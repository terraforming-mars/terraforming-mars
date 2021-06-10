import {expect} from 'chai';
import {Fish} from '../../../src/cards/base/Fish';
import {LocalHeatTrapping} from '../../../src/cards/base/LocalHeatTrapping';
import {Pets} from '../../../src/cards/base/Pets';
import {Helion} from '../../../src/cards/corporation/Helion';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('LocalHeatTrapping', () => {
  let card : LocalHeatTrapping; let player : Player;

  beforeEach(() => {
    card = new LocalHeatTrapping();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play without 5 heat', () => {
    player.cardsInHand = [card];
    expect(player.getPlayableCards()).is.empty;
  });

  it('Should play - no animal targets', () => {
    player.heat = 5;
    player.megaCredits = 1;
    player.cardsInHand = [card];
    expect(player.getPlayableCards()).does.include(card);

    card.play(player);
    player.playedCards.push(card);
    expect(player.plants).to.eq(4);
    expect(player.heat).to.eq(0);
  });

  it('Should play - single animal target', () => {
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

  it('Should play - multiple animal targets', () => {
    player.heat = 5;
    const pets = new Pets();
    const fish = new Fish();
    player.playedCards.push(card, pets, fish);

    const orOptions = card.play(player) as OrOptions;
    expect(player.heat).to.eq(0);
    orOptions.options[1].cb([fish]);
    expect(player.getResourcesOnCard(fish)).to.eq(2);
  });

  it('Cannot play as Helion if not enough heat left after paying for card', () => {
    const corp = new Helion();
    corp.play(player);
    player.corporationCard = corp;

    player.megaCredits = 0;
    player.heat = 5; // have to pay for card with 1 heat
    player.cardsInHand = [card];
    expect(player.getPlayableCards()).does.not.include(card);
    player.megaCredits = 1;
    expect(player.getPlayableCards()).does.include(card);
  });
});
