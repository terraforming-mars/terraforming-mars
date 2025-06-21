import {expect} from 'chai';
import {IshtarMining} from '../../../src/server/cards/venusNext/IshtarMining';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('IshtarMining', () => {
  it('Should play', () => {
    const card = new IshtarMining();
    const [game, player] = testGame(2);
    game.increaseVenusScaleLevel(player, 3);
    expect(card.canPlay(player)).is.not.true;
    game.increaseVenusScaleLevel(player, 3);
    expect(game.getVenusScaleLevel()).to.eq(12);
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(1);
  });
});
