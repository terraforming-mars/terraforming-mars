import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Supplier} from '../../../src/server/cards/prelude/Supplier';

describe('Supplier', function() {
  it('Should play', function() {
    const [, player] = testGame(1);
    const card = new Supplier();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
