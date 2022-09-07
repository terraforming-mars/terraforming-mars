import {expect} from 'chai';
import {SisterPlanetSupport} from '../../../src/server/cards/venusNext/SisterPlanetSupport';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SisterPlanetSupport', function() {
  it('Should play', function() {
    const card = new SisterPlanetSupport();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(3);
  });
});
