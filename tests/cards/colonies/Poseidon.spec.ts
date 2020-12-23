import {expect} from 'chai';
import {Poseidon} from '../../../src/cards/colonies/Poseidon';
import {Ceres} from '../../../src/colonies/Ceres';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Poseidon', function() {
  it('Should play', function() {
    const card = new Poseidon();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const play = card.play();
    expect(play).is.undefined;
    player.corporationCard = card;
    const ceres = new Ceres();
    ceres.addColony(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
