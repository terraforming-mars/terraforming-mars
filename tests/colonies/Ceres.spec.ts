import {expect} from 'chai';
import {Ceres} from '../../src/server/colonies/Ceres';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Ceres', function() {
  let ceres: Ceres;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    ceres = new Ceres();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(ceres);
  });

  it('Should build', function() {
    ceres.addColony(player);
    expect(player.production.steel).to.eq(1);
    expect(player2.production.steel).to.eq(0);
  });

  it('Should trade', function() {
    ceres.trade(player);
    expect(player.steel).to.eq(2);
    expect(player2.steel).to.eq(0);
  });

  it('Should give trade bonus', function() {
    ceres.addColony(player);

    ceres.trade(player2);
    runAllActions(game);

    expect(player.production.steel).to.eq(1);
    expect(player2.production.steel).to.eq(0);
    expect(player.steel).to.eq(2);
    expect(player2.steel).to.eq(2);
  });
});
