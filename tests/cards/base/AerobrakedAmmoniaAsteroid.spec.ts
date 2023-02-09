import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {AerobrakedAmmoniaAsteroid} from '../../../src/server/cards/base/AerobrakedAmmoniaAsteroid';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('AerobrakedAmmoniaAsteroid', function() {
  let card: AerobrakedAmmoniaAsteroid;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AerobrakedAmmoniaAsteroid();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play without microbe cards', function() {
    player.playedCards.push(card);
    const action = card.play(player);
    expect(player.production.heat).to.eq(3);
    expect(player.production.plants).to.eq(1);

    // It's okay to not have a card to collect Microbes on
    expect(action).is.undefined;
  });

  it('Adds microbes automatically if only 1 target', function() {
    player.playedCards.push(card);

    const selectedCard = new Ants();
    player.playedCards.push(selectedCard);

    card.play(player);
    runAllActions(game);

    expect(player.production.heat).to.eq(3);
    expect(player.production.plants).to.eq(1);
    expect(selectedCard.resourceCount).to.eq(2);
  });

  it('Adds microbes to another card', function() {
    player.playedCards.push(card);

    // Add card to collect Microbes on
    const selectedCard = new Ants();
    const otherMicrobeCard = new Decomposers();
    player.playedCards.push(selectedCard, otherMicrobeCard);

    expect(card.play(player)).is.undefined;

    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);

    expect(player.production.heat).to.eq(3);
    expect(player.production.plants).to.eq(1);

    action.cb([selectedCard]);

    expect(selectedCard.resourceCount).to.eq(2);
  });
});
