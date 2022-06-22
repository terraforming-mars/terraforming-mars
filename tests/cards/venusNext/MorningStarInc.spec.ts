import {expect} from 'chai';
import {IshtarMining} from '../../../src/cards/venusNext/IshtarMining';
import {MorningStarInc} from '../../../src/cards/venusNext/MorningStarInc';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('MorningStarInc', function() {
  it('Should play', function() {
    const corp = new MorningStarInc();
    const card = new IshtarMining();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    player.corporationCard = corp;
    game.increaseVenusScaleLevel(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(game.getVenusScaleLevel()).to.eq(6);
  });
});
