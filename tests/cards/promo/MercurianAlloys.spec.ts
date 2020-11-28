import {expect} from 'chai';
import {MercurianAlloys} from '../../../src/cards/promo/MercurianAlloys';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Research} from '../../../src/cards/base/Research';

describe('MercurianAlloys', function() {
  let card : MercurianAlloys; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MercurianAlloys();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player], player);
  });

  it('Can\'t play if not enough science tags available', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getTitaniumValue(game)).to.eq(4);
  });
});
