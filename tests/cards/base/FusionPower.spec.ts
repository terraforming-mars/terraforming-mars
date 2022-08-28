import {expect} from 'chai';
import {FusionPower} from '../../../src/server/cards/base/FusionPower';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('FusionPower', function() {
  let card: FusionPower;
  let player: Player;

  beforeEach(function() {
    card = new FusionPower();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card);
    expect(player.simpleCanPlay(card)).is.true;

    player.simplePlay(card);
    expect(player.production.energy).to.eq(3);
  });
});
