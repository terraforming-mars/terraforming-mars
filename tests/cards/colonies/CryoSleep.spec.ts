import {expect} from 'chai';
import {CryoSleep} from '../../../src/server/cards/colonies/CryoSleep';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('CryoSleep', function() {
  it('Should play', function() {
    const card = new CryoSleep();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    cast(card.play(player), undefined);
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
