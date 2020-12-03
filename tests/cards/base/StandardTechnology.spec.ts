
import {expect} from 'chai';
import {StandardTechnology} from '../../../src/cards/base/StandardTechnology';
import {StandardProjectType} from '../../../src/StandardProjectType';
import {TestPlayers} from '../../TestingUtils';

describe('StandardTechnology', function() {
  it('Should play', function() {
    const card = new StandardTechnology();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play();
    card.onStandardProject(player, StandardProjectType.SELLING_PATENTS);
    expect(player.megaCredits).to.eq(0);
    card.onStandardProject(player, StandardProjectType.ASTEROID);
    expect(player.megaCredits).to.eq(3);
    expect(action).is.undefined;
  });
});
