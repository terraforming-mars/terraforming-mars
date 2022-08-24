import {expect} from 'chai';
import {Luna} from '../../src/server/colonies/Luna';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Luna', function() {
  let luna: Luna;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    luna = new Luna();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(luna);
  });

  it('Should build', function() {
    luna.addColony(player);
    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(0);
  });

  it('Should trade', function() {
    luna.trade(player);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Should give trade bonus', function() {
    luna.addColony(player);

    luna.trade(player2);
    runAllActions(game);

    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(0);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(2);
  });
});
