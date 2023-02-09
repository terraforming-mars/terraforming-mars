import {expect} from 'chai';
import {IshtarMining} from '../../../src/server/cards/venusNext/IshtarMining';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('MorningStarInc', function() {
  it('Should play', function() {
    const corp = new MorningStarInc();
    const card = new IshtarMining();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    player.setCorporationForTest(corp);
    game.increaseVenusScaleLevel(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(game.getVenusScaleLevel()).to.eq(6);
  });
});
