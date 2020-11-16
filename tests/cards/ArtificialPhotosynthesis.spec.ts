
import {expect} from 'chai';
import {ArtificialPhotosynthesis} from '../../src/cards/ArtificialPhotosynthesis';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {OrOptions} from '../../src/inputs/OrOptions';
import {Resources} from '../../src/Resources';

describe('ArtificialPhotosynthesis', function() {
  it('Should play', function() {
    const card = new ArtificialPhotosynthesis();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.not.undefined;
    expect(action instanceof OrOptions).is.true;
    expect(action.options).has.lengthOf(2);
    action.options[0].cb();
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    action.options[1].cb();
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
