import {expect} from 'chai';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {SellPatentsStandardProject} from '../../../src/server/cards/base/standardProjects/SellPatentsStandardProject';
import {StandardTechnology} from '../../../src/server/cards/base/StandardTechnology';
import {TestPlayer} from '../../TestPlayer';

describe('StandardTechnology', function() {
  it('Should play', function() {
    const card = new StandardTechnology();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    card.onStandardProject(player, new SellPatentsStandardProject());
    expect(player.megaCredits).to.eq(0);
    card.onStandardProject(player, new AsteroidStandardProject());
    expect(player.megaCredits).to.eq(3);
    expect(action).is.undefined;
  });
});
