import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {Tag} from '../../../src/common/cards/Tag';

describe('ResearchCoordination', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new ResearchCoordination();
    const action = card.play(player);
    expect(action).is.undefined;

    expect(player.tags.count(Tag.WILD)).eq(0);
    expect(player.tags.count(Tag.BUILDING)).eq(0);

    player.playedCards.push(card);

    expect(player.tags.count(Tag.WILD)).eq(1);
    expect(player.tags.count(Tag.BUILDING)).eq(1);
    expect(player.tags.count(Tag.WILD, 'raw')).eq(1);
    expect(player.tags.count(Tag.BUILDING, 'raw')).eq(0);
  });
});
