import {expect} from 'chai';
import {MartianIndustries} from '../../../src/server/cards/prelude/MartianIndustries';
import {TestPlayer} from '../../TestPlayer';

describe('MartianIndustries', function() {
  it('Should play', function() {
    const card = new MartianIndustries();
    const player = TestPlayer.BLUE.newPlayer();
    const action = player.simplePlay(card);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player.production.steel).to.eq(1);
    expect(player.megaCredits).to.eq(6);
  });
});
