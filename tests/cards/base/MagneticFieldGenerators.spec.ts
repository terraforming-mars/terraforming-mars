import {expect} from 'chai';
import {MagneticFieldGenerators} from '../../../src/server/cards/base/MagneticFieldGenerators';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MagneticFieldGenerators', function() {
  let card: MagneticFieldGenerators;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MagneticFieldGenerators();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 4);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(2);
    expect(player.getTerraformRating()).to.eq(23);
  });
});
