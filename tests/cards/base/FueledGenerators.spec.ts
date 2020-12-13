import {expect} from 'chai';
import {FueledGenerators} from '../../../src/cards/base/FueledGenerators';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('FueledGenerators', function() {
  it('Should play', function() {
    const card = new FueledGenerators();
    const player = TestPlayers.BLUE.newPlayer();

    player.addProduction(Resources.PLANTS);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
