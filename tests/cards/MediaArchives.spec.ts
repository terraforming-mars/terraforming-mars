
import {expect} from 'chai';
import {MediaArchives} from '../../src/cards/MediaArchives';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Virus} from '../../src/cards/Virus';

describe('MediaArchives', function() {
  it('Should play', function() {
    const card = new MediaArchives();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    player.playedCards.push(card, new Virus());
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(1);
  });
});
