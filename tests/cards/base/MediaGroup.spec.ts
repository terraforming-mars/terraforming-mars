
import {expect} from 'chai';
import {MediaGroup} from '../../../src/cards/base/MediaGroup';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Virus} from '../../../src/cards/base/Virus';

describe('MediaGroup', function() {
  it('Should play', function() {
    const card = new MediaGroup();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play();
    expect(action).is.undefined;
    card.onCardPlayed(player, game, new Virus());
    expect(player.megaCredits).to.eq(3);
    card.onCardPlayed(player, game, card);
    expect(player.megaCredits).to.eq(3);
  });
});
