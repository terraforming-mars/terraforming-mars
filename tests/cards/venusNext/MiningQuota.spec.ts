import {expect} from 'chai';
import {MiningQuota} from '../../../src/server/cards/venusNext/MiningQuota';
import {SisterPlanetSupport} from '../../../src/server/cards/venusNext/SisterPlanetSupport';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('MiningQuota', function() {
  it('Should play', function() {
    const card = new MiningQuota();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
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

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.steel).to.eq(2);
  });
});
