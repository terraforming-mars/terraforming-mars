import {expect} from 'chai';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('VenusGovernor', () => {
  it('Should play', () => {
    const card = new VenusGovernor();
    const [/* game */, player] = testGame(1);

    player.tagsForTest = {venus: 1};
    expect(card.canPlay(player)).is.not.true;
    player.tagsForTest = {venus: 2};
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(2);
  });
});
