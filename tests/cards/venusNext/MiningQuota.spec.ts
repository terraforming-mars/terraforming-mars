import {expect} from 'chai';
import {MiningQuota} from '../../../src/server/cards/venusNext/MiningQuota';
import {SisterPlanetSupport} from '../../../src/server/cards/venusNext/SisterPlanetSupport';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MiningQuota', function() {
  it('Should play', function() {
    const card = new MiningQuota();
    const [/* game */, player] = testGame(1);
    player.playedCards.push(new SisterPlanetSupport);
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {venus: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {earth: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {jovian: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {venus: 1, earth: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {jovian: 1, earth: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1};
    expect(card.canPlay(player)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1, earth: 1};
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    expect(player.production.steel).to.eq(2);
  });
});
