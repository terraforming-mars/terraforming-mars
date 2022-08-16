import {expect} from 'chai';
import {BuildingIndustries} from '../../../src/server/cards/base/BuildingIndustries';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('BuildingIndustries', function() {
  let card: BuildingIndustries;
  let player: TestPlayer;

  beforeEach(function() {
    card = new BuildingIndustries();
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
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
