import {expect} from 'chai';
import {IshtarMining} from '../../../src/server/cards/venusNext/IshtarMining';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {testGame} from '../../TestGame';

describe('MorningStarInc', function() {
  it('Should play', function() {
    const corp = new MorningStarInc();
    const card = new IshtarMining();
    const [game, player] = testGame(2);
    player.setCorporationForTest(corp);
    game.increaseVenusScaleLevel(player, 3);
    expect(player.simpleCanPlay(card)).is.true;
    expect(game.getVenusScaleLevel()).to.eq(6);
  });
});
