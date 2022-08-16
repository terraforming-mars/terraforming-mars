import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {MercurianAlloys} from '../../../src/server/cards/promo/MercurianAlloys';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('MercurianAlloys', function() {
  let card: MercurianAlloys;
  let player: Player;

  beforeEach(function() {
    card = new MercurianAlloys();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Can not play if not enough science tags available', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getTitaniumValue()).to.eq(4);
  });
});
