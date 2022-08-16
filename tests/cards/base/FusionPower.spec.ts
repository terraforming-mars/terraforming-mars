import {expect} from 'chai';
import {FusionPower} from '../../../src/server/cards/base/FusionPower';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('FusionPower', function() {
  let card: FusionPower;
  let player: Player;

  beforeEach(function() {
    card = new FusionPower();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
