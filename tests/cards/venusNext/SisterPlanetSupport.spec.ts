import {expect} from 'chai';
import {SisterPlanetSupport} from '../../../src/server/cards/venusNext/SisterPlanetSupport';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('SisterPlanetSupport', function() {
  it('Should play', function() {
    const card = new SisterPlanetSupport();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
