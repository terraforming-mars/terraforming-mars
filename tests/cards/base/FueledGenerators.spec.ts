import {expect} from 'chai';
import {FueledGenerators} from '../../../src/server/cards/base/FueledGenerators';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('FueledGenerators', function() {
  it('Should play', function() {
    const card = new FueledGenerators();
    const [/* skipped */, player] = testGame(1);

    player.production.add(Resource.PLANTS, 1);
    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.energy).to.eq(1);
  });
});
