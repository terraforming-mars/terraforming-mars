import {expect} from 'chai';
import {SupplyDrop} from '../../../src/cards/prelude/SupplyDrop';
import {TestPlayers} from '../../TestPlayers';

describe('SupplyDrop', function() {
  it('Should play', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const card = new SupplyDrop();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.steel).to.eq(8);
    expect(player.titanium).to.eq(3);
    expect(player.plants).to.eq(3);
  });
});
