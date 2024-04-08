import {expect} from 'chai';
import {IndustrialMicrobes} from '../../../src/server/cards/base/IndustrialMicrobes';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('IndustrialMicrobes', function() {
  it('Should play', function() {
    const card = new IndustrialMicrobes();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });
});
