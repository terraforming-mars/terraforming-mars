import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {FusionPower} from '../../../src/server/cards/base/FusionPower';
import {TestPlayer} from '../../TestPlayer';

describe('FusionPower', function() {
  let card: FusionPower;
  let player: TestPlayer;

  beforeEach(function() {
    card = new FusionPower();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(3);
  });
});
