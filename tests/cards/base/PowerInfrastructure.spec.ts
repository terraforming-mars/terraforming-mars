import {expect} from 'chai';
import {PowerInfrastructure} from '../../../src/cards/base/PowerInfrastructure';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('PowerInfrastructure', function() {
  let card : PowerInfrastructure; let player : Player; let game : Game;

  beforeEach(function() {
    card = new PowerInfrastructure();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t act', function() {
    card.play(player, game);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    const action = card.action(player, game);
    action.cb(1);

    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });
});
