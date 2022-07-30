import {expect} from 'chai';
import {PolarIndustries} from '../../../src/cards/prelude/PolarIndustries';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';


describe('PolarIndustries', function() {
  it('Should play', function() {
    const card = new PolarIndustries();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
