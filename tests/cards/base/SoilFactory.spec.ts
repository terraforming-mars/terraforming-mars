import {expect} from 'chai';
import {SoilFactory} from '../../../src/server/cards/base/SoilFactory';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('SoilFactory', function() {
  let card: SoilFactory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SoilFactory();
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
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
