import {expect} from 'chai';
import {InventorsGuild} from '../../../src/cards/base/InventorsGuild';
import {Plantation} from '../../../src/cards/base/Plantation';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Plantation', function() {
  let card : Plantation; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Plantation();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new InventorsGuild(), new InventorsGuild());
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
