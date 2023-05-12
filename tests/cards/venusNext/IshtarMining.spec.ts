import {expect} from 'chai';
import {IshtarMining} from '../../../src/server/cards/venusNext/IshtarMining';
import {testGame} from '../../TestGame';

describe('IshtarMining', function() {
  it('Should play', function() {
    const card = new IshtarMining();
    const [game, player] = testGame(2);
    game.increaseVenusScaleLevel(player, 3);
    expect(player.simpleCanPlay(card)).is.not.true;
    game.increaseVenusScaleLevel(player, 3);
    expect(game.getVenusScaleLevel()).to.eq(12);
    expect(player.simpleCanPlay(card)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
  });
});
