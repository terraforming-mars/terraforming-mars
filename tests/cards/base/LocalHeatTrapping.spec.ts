import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Fish} from '../../../src/server/cards/base/Fish';
import {LocalHeatTrapping} from '../../../src/server/cards/base/LocalHeatTrapping';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('LocalHeatTrapping', () => {
  let card: LocalHeatTrapping;
  let player: TestPlayer;

  beforeEach(() => {
    card = new LocalHeatTrapping();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play without 5 heat', () => {
    player.megaCredits = card.cost;
    player.cardsInHand = [card];
    expect(player.canPlay(card)).is.false;
    player.heat = 4;
    expect(player.canPlay(card)).is.false;
    player.heat = 5;
    expect(player.canPlay(card)).is.true;
  });

  it('Should play - no animal targets', () => {
    player.megaCredits = card.cost;
    player.heat = 6;
    player.megaCredits = 1;
    player.cardsInHand = [card];

    expect(player.canPlay(card)).is.true;

    card.play(player);

    expect(player.plants).to.eq(4);
    expect(player.heat).to.eq(1);
  });

  it('Should play - single animal target', () => {
    player.heat = 5;
    const pets = new Pets();
    player.playedCards.push(card, pets);

    const orOptions = cast(card.play(player), OrOptions);

    orOptions.options[0].cb();
    expect(player.plants).to.eq(4);
    expect(player.heat).to.eq(0);

    orOptions.options[1].cb();
    expect(pets.resourceCount).to.eq(2);
  });

  it('Should play - multiple animal targets', () => {
    player.heat = 5;
    const pets = new Pets();
    const fish = new Fish();
    player.playedCards.push(card, pets, fish);

    const orOptions = cast(card.play(player), OrOptions);
    expect(player.heat).to.eq(0);
    orOptions.options[1].cb([fish]);
    expect(fish.resourceCount).to.eq(2);
  });

  it('Cannot play as Helion if not enough heat left after paying for card', () => {
    const corp = new Helion();
    corp.play(player);
    player.setCorporationForTest(corp);

    player.megaCredits = 0;
    player.heat = 5; // have to pay for card with 1 heat
    player.cardsInHand = [card];
    expect(player.canPlay(card)).is.false;
    player.megaCredits = 1;
    expect(player.canPlay(card)).is.true;
  });
});
