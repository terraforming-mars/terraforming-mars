import {expect} from 'chai';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('HousePrinting', function() {
  it('Should play', function() {
    const card = new HousePrinting();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });
});
