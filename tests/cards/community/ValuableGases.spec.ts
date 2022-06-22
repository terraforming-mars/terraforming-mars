import {expect} from 'chai';
import {ValuableGases} from '../../../src/cards/community/ValuableGases';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ValuableGases', function() {
  let card : ValuableGases; let player : Player;

  beforeEach(function() {
    card = new ValuableGases();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(6);
  });
});
