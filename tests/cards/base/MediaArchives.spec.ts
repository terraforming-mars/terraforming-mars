import {expect} from 'chai';
import {MediaArchives} from '../../../src/server/cards/base/MediaArchives';
import {Virus} from '../../../src/server/cards/base/Virus';
import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {ImportedHydrogen} from '../../../src/server/cards/base/ImportedHydrogen';
import {testGame} from '../../TestingUtils';
import {cast} from '../../../src/common/utils/utils';
import {Tag} from '../../../src/common/cards/Tag';
import {MarsBotTags} from '../../../src/server/automa/MarsBotTags';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

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

  // MarsBot has no played events: its event track counts instead.
  it('counts MarsBot\'s event track', () => {
    const card = new MediaArchives();
    const [game, player] = testGame(1, {automa: true});
    const bot = fakeMarsBot();
    game.marsBotPlayer!.tags = new MarsBotTags(game.marsBotPlayer!, bot.marsBotBoard);
    setTrack(bot, Tag.EVENT, 4);
    player.playedCards.push(card, new Virus());

    cast(card.play(player), undefined);

    expect(player.megaCredits).to.eq(1 + 4);
  });
});
