import {expect} from 'chai';
import {PolarIndustries} from '../../../src/server/cards/prelude/PolarIndustries';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';


describe('PolarIndustries', function() {
  it('Should play', function() {
    const card = new PolarIndustries();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(2);
  });
});
