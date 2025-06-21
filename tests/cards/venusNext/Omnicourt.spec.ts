import {expect} from 'chai';
import {Omnicourt} from '../../../src/server/cards/venusNext/Omnicourt';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Omnicourt', () => {
  it('Should play', () => {
    const card = new Omnicourt();
    const [/* game */, player] = testGame(2);
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
    expect(player.getTerraformRating()).to.eq(22);
  });
});
