import {expect} from 'chai';
import {Luna} from '../../src/server/colonies/Luna';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Luna', function() {
  let luna: Luna;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    luna = new Luna();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(luna);
  });

  it('Should build', function() {
    luna.addColony(player);
    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(0);
  });

  it('Should trade', function() {
    luna.trade(player);
    expect(player.stock.megacredits).to.eq(2);
    expect(player2.stock.megacredits).to.eq(0);
  });

  it('Should give trade bonus', function() {
    luna.addColony(player);

    luna.trade(player2);
    runAllActions(game);

    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(0);
    expect(player.stock.megacredits).to.eq(2);
    expect(player2.stock.megacredits).to.eq(2);
  });
});
