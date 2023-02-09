import {expect} from 'chai';
import {Poseidon} from '../../../src/server/cards/colonies/Poseidon';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

// TODO: add a test for Posideon's initial action.

describe('Poseidon', function() {
  it('Should play', function() {
    const card = new Poseidon();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    const play = card.play(player);
    expect(play).is.undefined;
    player.setCorporationForTest(card);
    const ceres = new Ceres();
    ceres.addColony(player);
    expect(player.production.megacredits).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });
});
