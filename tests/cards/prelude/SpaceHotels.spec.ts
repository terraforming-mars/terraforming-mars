import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {SpaceHotels} from '../../../src/server/cards/prelude/SpaceHotels';
import {testGame} from '../../TestGame';

describe('SpaceHotels', function() {
  let card: SpaceHotels;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SpaceHotels();
    [/* skipped */, player] = testGame(1);
  });

  it('Can not play', function() {
    player.playedCards.push(card);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(4);
  });
});
