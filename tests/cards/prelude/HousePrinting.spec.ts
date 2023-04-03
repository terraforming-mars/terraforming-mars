import {expect} from 'chai';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {testGame} from '../../TestGame';

describe('HousePrinting', function() {
  it('Should play', function() {
    const card = new HousePrinting();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });
});
