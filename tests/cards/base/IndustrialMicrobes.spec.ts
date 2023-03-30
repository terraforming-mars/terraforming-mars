import {expect} from 'chai';
import {IndustrialMicrobes} from '../../../src/server/cards/base/IndustrialMicrobes';
import {testGame} from '../../TestGame';

describe('IndustrialMicrobes', function() {
  it('Should play', function() {
    const card = new IndustrialMicrobes();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });
});
