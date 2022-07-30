import {expect} from 'chai';
import {LuxuryFoods} from '../../../src/cards/venusNext/LuxuryFoods';
import {TestPlayer} from '../../TestPlayer';

describe('LuxuryFoods', function() {
  it('Should play', function() {
    const card = new LuxuryFoods();
    const player = TestPlayer.BLUE.newPlayer();
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

    const action = card.play();
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
