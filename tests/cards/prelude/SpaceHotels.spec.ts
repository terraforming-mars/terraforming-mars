import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {SpaceHotels} from '../../../src/server/cards/prelude/SpaceHotels';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SpaceHotels', function() {
  let card: SpaceHotels;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SpaceHotels();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
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
