import {expect} from 'chai';
import {Poseidon} from '../../../src/cards/colonies/Poseidon';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {Ceres} from '../../../src/colonies/Ceres';

describe('Poseidon', function() {
  it('Should play', function() {
    const card = new Poseidon();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    const play = card.play();
    expect(play).is.undefined;
    player.corporationCard = card;
    const ceres = new Ceres();
    ceres.onColonyPlaced(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
