import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SupplyDrop} from '../../../src/server/cards/prelude/SupplyDrop';
import {cast} from '../../TestingUtils';

describe('SupplyDrop', function() {
  it('Should play', function() {
    const [/* game */, player] = testGame(1);
    const card = new SupplyDrop();
    cast(card.play(player), undefined);
    expect(player.steel).to.eq(8);
    expect(player.titanium).to.eq(3);
    expect(player.plants).to.eq(3);
  });
});
