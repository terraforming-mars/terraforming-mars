import {expect} from 'chai';
import {ValuableGases} from '../../../src/cards/community/ValuableGases';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('ValuableGases', function() {
  let card : ValuableGases; let player : Player; let game: Game;

  beforeEach(function() {
    card = new ValuableGases();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(player.megaCredits).to.eq(6);
  });
});
