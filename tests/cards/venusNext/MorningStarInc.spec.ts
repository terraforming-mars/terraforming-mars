
import {expect} from 'chai';
import {MorningStarInc} from '../../../src/cards/venusNext/MorningStarInc';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {IshtarMining} from '../../../src/cards/venusNext/IshtarMining';

describe('MorningStarInc', function() {
  it('Should play', function() {
    const corp = new MorningStarInc();
    const card = new IshtarMining();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    player.corporationCard = corp;
    game.increaseVenusScaleLevel(player, 3);
    expect(card.canPlay(player, game)).is.true;
    expect(game.getVenusScaleLevel()).to.eq(6);
  });
});
