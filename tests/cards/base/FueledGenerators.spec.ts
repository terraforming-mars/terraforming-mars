import {expect} from 'chai';
import {FueledGenerators} from '../../../src/cards/base/FueledGenerators';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('FueledGenerators', function() {
  it('Should play', function() {
    const card = new FueledGenerators();
    const player = TestPlayer.BLUE.newPlayer();

    player.addProduction(Resources.PLANTS, 1);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
