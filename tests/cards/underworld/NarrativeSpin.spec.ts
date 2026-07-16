import {expect} from 'chai';
import {NarrativeSpin} from '../../../src/server/cards/underworld/NarrativeSpin';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('NarrativeSpin', () => {
  it('Should play', () => {
    const card = new NarrativeSpin();
    const [/* game */, player] = testGame(2);

    player.tagsForTest = {earth: 0};
    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {earth: 1};
    expect(card.canPlay(player)).is.true;

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).to.eq(2);
  });
});
