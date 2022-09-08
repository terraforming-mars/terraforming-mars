import {expect} from 'chai';
import {GHGImportFromVenus} from '../../../src/server/cards/venusNext/GHGImportFromVenus';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('GHGImportFromVenus', function() {
  it('Should play', function() {
    const card = new GHGImportFromVenus();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
