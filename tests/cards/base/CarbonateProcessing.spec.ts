import {expect} from 'chai';
import {CarbonateProcessing} from '../../../src/server/cards/base/CarbonateProcessing';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('CarbonateProcessing', function() {
  let card: CarbonateProcessing;
  let player: Player;

  beforeEach(function() {
    card = new CarbonateProcessing();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.true;

    player.simplePlay(card);
    expect(player.production.energy).to.eq(0);
    expect(player.production.heat).to.eq(3);
  });
});
