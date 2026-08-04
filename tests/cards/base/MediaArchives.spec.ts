import {expect} from 'chai';
import {MediaArchives} from '../../../src/server/cards/base/MediaArchives';
import {Virus} from '../../../src/server/cards/base/Virus';
import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {ImportedHydrogen} from '../../../src/server/cards/base/ImportedHydrogen';
import {testGame} from '../../TestingUtils';
import {cast} from '../../../src/common/utils/utils';

describe('MediaArchives', () => {
  it('Should play', () => {
    const card = new MediaArchives();
    const [/* game */, player, player2] = testGame(2);
    player.playedCards.push(card, new Virus());
    player2.playedCards.push(new IceAsteroid(), new ImportedHydrogen());

    cast(card.play(player), undefined);

    // Every player's events count, not just your own.
    expect(player.megaCredits).to.eq(3);
  });
});
