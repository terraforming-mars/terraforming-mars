import {expect} from 'chai';
import {MiningQuota} from '../../../src/cards/venusNext/MiningQuota';
import {SisterPlanetSupport} from '../../../src/cards/venusNext/SisterPlanetSupport';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MiningQuota', function() {
  it('Should play', function() {
    const card = new MiningQuota();
    const player = TestPlayers.BLUE.newPlayer();
    player.playedCards.push(new SisterPlanetSupport);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {jovian: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {jovian: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
