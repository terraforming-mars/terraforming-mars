import {expect} from 'chai';
import {Ironworks} from '../../../src/server/cards/base/Ironworks';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Ironworks', function() {
  let card: Ironworks;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Ironworks();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act without enough energy', function() {
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
