import {expect} from 'chai';
import {LuxuryFoods} from '../../../src/server/cards/venusNext/LuxuryFoods';
import {testGame} from '../../TestGame';

describe('LuxuryFoods', function() {
  it('Should play', function() {
    const card = new LuxuryFoods();
    const [, player] = testGame(1);
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

    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
