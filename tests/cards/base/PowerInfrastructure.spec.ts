import {expect} from 'chai';
import {PowerInfrastructure} from '../../../src/cards/base/PowerInfrastructure';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('PowerInfrastructure', function() {
  let card : PowerInfrastructure; let player : Player;

  beforeEach(function() {
    card = new PowerInfrastructure();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act', function() {
    card.play(player);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    const action = card.action(player);
    action.cb(1);

    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });
});
