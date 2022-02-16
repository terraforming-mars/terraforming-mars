import {expect} from 'chai';
import {Fish} from '../../../src/cards/base/Fish';
import {LargeConvoy} from '../../../src/cards/base/LargeConvoy';
import {Pets} from '../../../src/cards/base/Pets';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('LargeConvoy', function() {
  let card : LargeConvoy; let player : TestPlayer;

  beforeEach(function() {
    card = new LargeConvoy();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play without animal cards', function() {
    card.play(player);

    expect(card.getVictoryPoints()).to.eq(2);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.plants).to.eq(5);
  });

  it('Should play with single animal target', function() {
    const pets = new Pets();
    player.playedCards.push(pets);

    const action = card.play(player);
    player.playedCards.push(card);
    (action as OrOptions).options[1].cb();
    const vps = player.getVictoryPoints();

    expect(vps.victoryPoints).to.eq(4);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(pets.resourceCount).to.eq(4);
    expect(player.plants).to.eq(0);
  });

  it('Should play with multiple animal targets', function() {
    const pets = new Pets();
    const fish = new Fish();
    player.playedCards.push(pets, fish);

    const action = card.play(player);
    expect(action).is.not.undefined;

    expect(card.getVictoryPoints()).to.eq(2);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.plants).to.eq(0);

    (action as OrOptions).options[1].cb([pets]);
    expect(pets.resourceCount).to.eq(4);
  });

  it('Should play without oceans', function() {
    const pets = new Pets();
    player.playedCards.push(pets);
    TestingUtils.maxOutOceans(player);
    const plantsCount = player.plants;
    const cardsInHand = player.cardsInHand.length;

    const action = card.play(player);
    expect(action).is.not.undefined;

    expect(card.getVictoryPoints()).to.eq(2);
    expect(player.cardsInHand).has.lengthOf(cardsInHand + 2);

    (action as OrOptions).options[0].cb();
    expect(player.plants).to.eq(plantsCount + 5);
  });
});
