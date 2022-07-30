import {expect} from 'chai';
import {IshtarMining} from '../../../src/cards/venusNext/IshtarMining';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('IshtarMining', function() {
  it('Should play', function() {
    const card = new IshtarMining();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    game.increaseVenusScaleLevel(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    game.increaseVenusScaleLevel(player, 3);
    expect(game.getVenusScaleLevel()).to.eq(12);
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
