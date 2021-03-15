import {expect} from 'chai';
import {Ironworks} from '../../../src/cards/base/Ironworks';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Ironworks', function() {
  let card : Ironworks; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Ironworks();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act without enough energy', function() {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 4;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.steel).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
