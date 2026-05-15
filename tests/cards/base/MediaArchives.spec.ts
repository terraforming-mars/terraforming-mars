import {expect} from 'chai';
import {MediaArchives} from '../../../src/server/cards/base/MediaArchives';
import {Virus} from '../../../src/server/cards/base/Virus';
import {testGame} from '../../TestingUtils';
import {cast} from '../../../src/common/utils/utils';

describe('MediaArchives', () => {
  it('Should play', () => {
    const card = new MediaArchives();
    const [/* game */, player] = testGame(1);
    player.playedCards.push(card, new Virus());
    cast(card.play(player), undefined);
    expect(player.megaCredits).to.eq(1);
  });
});
