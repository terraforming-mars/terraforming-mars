import {expect} from 'chai';
import {StandardTechnology} from '../../../src/cards/base/StandardTechnology';
import {TestPlayers} from '../../TestingUtils';
import {AsteroidStandard} from '../../../src/cards/standardProjects/Asteroid';
import {SellPatents} from '../../../src/cards/standardProjects/SellPatents';

describe('StandardTechnology', function() {
  it('Should play', function() {
    const card = new StandardTechnology();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play();
    card.onStandardProject(player, new SellPatents());
    expect(player.megaCredits).to.eq(0);
    card.onStandardProject(player, new AsteroidStandard());
    expect(player.megaCredits).to.eq(3);
    expect(action).is.undefined;
  });
});
