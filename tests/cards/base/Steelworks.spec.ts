import {expect} from 'chai';
import {Steelworks} from '../../../src/server/cards/base/Steelworks';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Steelworks', function() {
  let card: Steelworks;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Steelworks();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act', function() {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 4;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.steel).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
