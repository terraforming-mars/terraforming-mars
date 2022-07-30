import {expect} from 'chai';
import {MediaArchives} from '../../../src/cards/base/MediaArchives';
import {Virus} from '../../../src/cards/base/Virus';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('MediaArchives', function() {
  it('Should play', function() {
    const card = new MediaArchives();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    player.playedCards.push(card, new Virus());
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(1);
  });
});
