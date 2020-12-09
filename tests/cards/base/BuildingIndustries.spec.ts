import {expect} from 'chai';
import {BuildingIndustries} from '../../../src/cards/base/BuildingIndustries';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('BuildingIndustries', function() {
  let card : BuildingIndustries; let player : Player;

  beforeEach(function() {
    card = new BuildingIndustries();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
