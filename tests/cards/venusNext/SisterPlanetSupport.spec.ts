import {expect} from 'chai';
import {SisterPlanetSupport} from '../../../src/server/cards/venusNext/SisterPlanetSupport';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SisterPlanetSupport', () => {
  it('Should play', () => {
    const card = new SisterPlanetSupport();
    const [/* game */, player] = testGame(1);
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {venus: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {earth: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {venus: 1, earth: 1};
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(3);
  });
});
