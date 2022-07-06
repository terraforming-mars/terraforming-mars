import {expect} from 'chai';
import {Fish} from '../../../src/cards/base/Fish';
import {LargeConvoy} from '../../../src/cards/base/LargeConvoy';
import {Pets} from '../../../src/cards/base/Pets';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('LargeConvoy', function() {
  let card : LargeConvoy; let player : TestPlayer;

  beforeEach(function() {
    card = new LargeConvoy();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
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

    const action = cast(card.play(player), OrOptions);
    player.playedCards.push(card);
    action.options[1].cb();
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

    const action = cast(card.play(player), OrOptions);

    expect(card.getVictoryPoints()).to.eq(2);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.plants).to.eq(0);

    action.options[1].cb([pets]);
    expect(pets.resourceCount).to.eq(4);
  });

  it('Should play without oceans', function() {
    const pets = new Pets();
    player.playedCards.push(pets);
    maxOutOceans(player);
    const plantsCount = player.plants;
    const cardsInHand = player.cardsInHand.length;

    const action = cast(card.play(player), OrOptions);

    expect(card.getVictoryPoints()).to.eq(2);
    expect(player.cardsInHand).has.lengthOf(cardsInHand + 2);

    action.options[0].cb();
    expect(player.plants).to.eq(plantsCount + 5);
  });
});
