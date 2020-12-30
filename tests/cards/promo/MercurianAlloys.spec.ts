import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {MercurianAlloys} from '../../../src/cards/promo/MercurianAlloys';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('MercurianAlloys', function() {
  let card : MercurianAlloys; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MercurianAlloys();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
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
