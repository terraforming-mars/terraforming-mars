import {expect} from 'chai';
import {Omnicourt} from '../../../src/server/cards/venusNext/Omnicourt';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Omnicourt', function() {
  it('Should play', function() {
    const card = new Omnicourt();
    const [/* game */, player] = testGame(2);
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
    expect(player.getTerraformRating()).to.eq(22);
  });
});
