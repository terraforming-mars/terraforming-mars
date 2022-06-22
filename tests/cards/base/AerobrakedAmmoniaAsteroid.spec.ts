import {expect} from 'chai';
import {AerobrakedAmmoniaAsteroid} from '../../../src/cards/base/AerobrakedAmmoniaAsteroid';
import {Ants} from '../../../src/cards/base/Ants';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('AerobrakedAmmoniaAsteroid', function() {
  let card : AerobrakedAmmoniaAsteroid; let player : Player;

  beforeEach(function() {
    card = new AerobrakedAmmoniaAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play without microbe cards', function() {
    player.playedCards.push(card);
    const action = card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);

    // It's okay to not have a card to collect Microbes on
    expect(action).is.undefined;
  });

  it('Adds microbes automatically if only 1 target', function() {
    player.playedCards.push(card);

    const selectedCard = new Ants();
    player.playedCards.push(selectedCard);

    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(selectedCard.resourceCount).to.eq(2);
  });

  it('Adds microbes to another card', function() {
    player.playedCards.push(card);

    // Add card to collect Microbes on
    const selectedCard = new Ants();
    const otherMicrobeCard = new Decomposers();
    player.playedCards.push(selectedCard, otherMicrobeCard);

    const action = card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);

    expect(action).is.not.undefined;
        action!.cb([selectedCard]);

        expect(selectedCard.resourceCount).to.eq(2);
  });
});
