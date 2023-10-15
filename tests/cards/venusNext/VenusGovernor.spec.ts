import {expect} from 'chai';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('VenusGovernor', function() {
  it('Should play', function() {
    const card = new VenusGovernor();
    const [/* skipped */, player] = testGame(1);

    player.tagsForTest = {venus: 1};
    expect(player.simpleCanPlay(card)).is.not.true;
    player.tagsForTest = {venus: 2};
    expect(player.simpleCanPlay(card)).is.true;

    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(2);
  });
});
