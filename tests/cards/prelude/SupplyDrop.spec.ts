import {expect} from 'chai';
import {SupplyDrop} from '../../../src/server/cards/prelude/SupplyDrop';
import {TestPlayer} from '../../TestPlayer';

describe('SupplyDrop', function() {
  it('Should play', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const card = new SupplyDrop();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.steel).to.eq(8);
    expect(player.titanium).to.eq(3);
    expect(player.plants).to.eq(3);
  });
});
