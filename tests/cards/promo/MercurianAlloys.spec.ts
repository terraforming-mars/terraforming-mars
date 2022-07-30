import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {MercurianAlloys} from '../../../src/cards/promo/MercurianAlloys';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
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
