import {expect} from 'chai';
import {IshtarMining} from '../../../src/server/cards/venusNext/IshtarMining';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('MorningStarInc', function() {
  it('Should play', function() {
    const corp = new MorningStarInc();
    const card = new IshtarMining();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.setCorporationForTest(corp);
    game.increaseVenusScaleLevel(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(game.getVenusScaleLevel()).to.eq(6);
  });
});
