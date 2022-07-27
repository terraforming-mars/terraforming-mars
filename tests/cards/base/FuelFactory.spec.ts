import {expect} from 'chai';
import {FuelFactory} from '../../../src/cards/base/FuelFactory';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('FuelFactory', function() {
  let card: FuelFactory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new FuelFactory();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
