import {expect} from 'chai';
import {PublicSpaceline} from '../../../src/server/cards/underworld/PublicSpaceline';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

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

    expect(player.tags.countAllTags()).to.have.deep.members([
      {tag: 'earth', count: 2},
      {tag: 'jovian', count: 2},
      {tag: 'venus', count: 2},
      {tag: 'mars', count: 2},
      {tag: 'event', count: 0},
    ]);
  });
});
