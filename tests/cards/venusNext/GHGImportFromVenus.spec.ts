import {expect} from 'chai';
import {GHGImportFromVenus} from '../../../src/cards/venusNext/GHGImportFromVenus';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('GHGImportFromVenus', function() {
  it('Should play', function() {
    const card = new GHGImportFromVenus();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
