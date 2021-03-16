import {expect} from 'chai';
import {MartianIndustries} from '../../../src/cards/prelude/MartianIndustries';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MartianIndustries', function() {
  it('Should play', function() {
    const card = new MartianIndustries();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.megaCredits).to.eq(6);
  });
});
