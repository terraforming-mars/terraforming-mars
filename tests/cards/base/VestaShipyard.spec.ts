import {expect} from 'chai';
import {VestaShipyard} from '../../../src/cards/base/VestaShipyard';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('VestaShipyard', function() {
  it('Should play', function() {
    const card = new VestaShipyard();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    card.play(player);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
