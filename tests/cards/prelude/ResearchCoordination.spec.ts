import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {Tag} from '../../../src/common/cards/Tag';
import {cast} from '../../TestingUtils';

describe('ResearchCoordination', () => {
  it('Should play', () => {
    const [/* game */, player] = testGame(1);
    const card = new ResearchCoordination();
    cast(card.play(player), undefined);
    expect(player.tags.count(Tag.WILD)).eq(0);
    expect(player.tags.count(Tag.BUILDING)).eq(0);

    player.playedCards.push(card);

    expect(player.tags.count(Tag.WILD)).eq(1);
    expect(player.tags.count(Tag.BUILDING)).eq(1);
    expect(player.tags.count(Tag.WILD, 'raw')).eq(1);
    expect(player.tags.count(Tag.BUILDING, 'raw')).eq(0);
  });
});
