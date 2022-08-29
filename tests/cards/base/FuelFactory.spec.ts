import {expect} from 'chai';
import {FuelFactory} from '../../../src/server/cards/base/FuelFactory';
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
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.true;
    player.simplePlay(card);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
    expect(player.production.titanium).to.eq(1);
  });
});
