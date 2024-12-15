import {expect} from 'chai';
import {PublicSpaceline} from '../../../src/server/cards/underworld/PublicSpaceline';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';

describe('PublicSpaceline', () => {
  it('Can play', () => {
    const card = new PublicSpaceline();
    const [/* game */, player] = testGame(2);

    player.tagsForTest = {space: 4};

    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {space: 5};

    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new PublicSpaceline();
    const [/* game */, player] = testGame(2);

    cast(card.play(player), undefined);

    player.playedCards.push(card);

    const counts = player.tags.countAllTags();
    expect(counts[Tag.EARTH]).eq(2);
    expect(counts[Tag.JOVIAN]).eq(2);
    expect(counts[Tag.VENUS]).eq(2);
    expect(counts[Tag.MARS]).eq(2);
    expect(counts[Tag.EVENT]).eq(0);
    expect(player.production.megacredits).eq(2);
  });
});
