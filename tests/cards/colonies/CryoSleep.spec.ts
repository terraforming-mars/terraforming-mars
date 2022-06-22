import {expect} from 'chai';
import {CryoSleep} from '../../../src/cards/colonies/CryoSleep';
import {Ceres} from '../../../src/colonies/Ceres';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('CryoSleep', function() {
  it('Should play', function() {
    const card = new CryoSleep();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
