import {expect} from 'chai';
import {ValuableGases} from '../../../src/cards/community/ValuableGases';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ValuableGases', function() {
  let card: ValuableGases;
  let player: Player;

  beforeEach(function() {
    card = new ValuableGases();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(6);
  });
});
