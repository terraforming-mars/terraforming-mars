import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {FusionPower} from '../../../src/server/cards/base/FusionPower';
import {TestPlayer} from '../../TestPlayer';

describe('FusionPower', function() {
  let card: FusionPower;
  let player: TestPlayer;

  beforeEach(function() {
    card = new FusionPower();
    [/* skipped */, player] = testGame(1);
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
