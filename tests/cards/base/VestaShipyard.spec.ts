import {expect} from 'chai';
import {VestaShipyard} from '../../../src/cards/base/VestaShipyard';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('VestaShipyard', function() {
  it('Should play', function() {
    const card = new VestaShipyard();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);

    card.play(player, game);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
