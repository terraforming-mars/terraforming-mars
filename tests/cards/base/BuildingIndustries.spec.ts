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
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.true;

    player.simplePlay(card);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
  });
});
