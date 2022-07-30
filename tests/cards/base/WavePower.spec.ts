import {expect} from 'chai';
import {WavePower} from '../../../src/cards/base/WavePower';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {maxOutOceans} from '../../TestingUtils';

describe('WavePower', function() {
  let card: WavePower;
  let player: TestPlayer;

  beforeEach(function() {
    card = new WavePower();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    maxOutOceans(player, 2);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
