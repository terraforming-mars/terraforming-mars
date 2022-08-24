import {expect} from 'chai';
import {SpaceHotels} from '../../../src/server/cards/prelude/SpaceHotels';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('SpaceHotels', function() {
  let card: SpaceHotels;
  let player: Player;

  beforeEach(function() {
    card = new SpaceHotels();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    player.playedCards.push(card);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(4);
  });
});
