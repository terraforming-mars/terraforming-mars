import {expect} from 'chai';
import {InventorsGuild} from '../../../src/cards/base/InventorsGuild';
import {Plantation} from '../../../src/cards/base/Plantation';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('Plantation', function() {
  let card : Plantation; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Plantation();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new InventorsGuild(), new InventorsGuild());
    expect(card.canPlay(player, game)).is.true;

    const action = card.play(player, game);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
