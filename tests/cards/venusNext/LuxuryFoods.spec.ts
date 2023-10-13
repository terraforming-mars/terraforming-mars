import {expect} from 'chai';
import {LuxuryFoods} from '../../../src/server/cards/venusNext/LuxuryFoods';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('LuxuryFoods', function() {
  it('Should play', function() {
    const card = new LuxuryFoods();
    const [/* skipped */, player] = testGame(1);
    expect(player.simpleCanPlay(card)).is.not.true;

    player.tagsForTest = {venus: 1};
    expect(player.simpleCanPlay(card)).is.not.true;

    player.tagsForTest = {earth: 1};
    expect(player.simpleCanPlay(card)).is.not.true;

    player.tagsForTest = {jovian: 1};
    expect(player.simpleCanPlay(card)).is.not.true;

    player.tagsForTest = {venus: 1, earth: 1};
    expect(player.simpleCanPlay(card)).is.not.true;

    player.tagsForTest = {jovian: 1, earth: 1};
    expect(player.simpleCanPlay(card)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1};
    expect(player.simpleCanPlay(card)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1, earth: 1};
    expect(player.simpleCanPlay(card)).is.true;

    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
