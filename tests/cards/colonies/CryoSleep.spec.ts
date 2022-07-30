import {expect} from 'chai';
import {CryoSleep} from '../../../src/cards/colonies/CryoSleep';
import {Ceres} from '../../../src/colonies/Ceres';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('CryoSleep', function() {
  it('Should play', function() {
    const card = new CryoSleep();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
