import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Supplier} from '../../../src/server/cards/prelude/Supplier';
import {cast} from '../../TestingUtils';

describe('Supplier', function() {
  it('Should play', function() {
    const [/* skipped */, player] = testGame(1);
    const card = new Supplier();
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
