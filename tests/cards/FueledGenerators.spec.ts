
import {expect} from 'chai';
import {FueledGenerators} from '../../src/cards/FueledGenerators';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';

describe('FueledGenerators', function() {
  it('Should play', function() {
    const card = new FueledGenerators();
    const player = new Player('test', Color.BLUE, false);
    player.addProduction(Resources.PLANTS);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
  });
});
