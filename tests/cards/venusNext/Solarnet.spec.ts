import {expect} from 'chai';
import {Solarnet} from '../../../src/server/cards/venusNext/Solarnet';
import {testGame} from '../../TestGame';

describe('Solarnet', function() {
  it('Should play', function() {
    const card = new Solarnet();
    const [, player] = testGame(2);
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
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
