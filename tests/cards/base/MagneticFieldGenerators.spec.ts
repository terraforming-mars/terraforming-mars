import {expect} from 'chai';
import {MagneticFieldGenerators} from '../../../src/server/cards/base/MagneticFieldGenerators';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MagneticFieldGenerators', () => {
  let card: MagneticFieldGenerators;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MagneticFieldGenerators();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(2);
    expect(player.getTerraformRating()).to.eq(23);
  });
});
