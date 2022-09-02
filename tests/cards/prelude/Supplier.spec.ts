import {expect} from 'chai';
import {Supplier} from '../../../src/server/cards/prelude/Supplier';
import {TestPlayer} from '../../TestPlayer';

describe('Supplier', function() {
  it('Should play', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const card = new Supplier();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
