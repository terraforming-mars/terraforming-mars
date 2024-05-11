import {expect} from 'chai';
import {Callisto} from '../../src/server/colonies/Callisto';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Callisto', function() {
  let callisto: Callisto;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    callisto = new Callisto();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(callisto);
  });

  it('Should build', function() {
    callisto.addColony(player);
    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
  });

  it('Should trade', function() {
    callisto.trade(player);
    expect(player.energy).to.eq(2);
    expect(player2.energy).to.eq(0);
  });

  it('Should give trade bonus', function() {
    callisto.addColony(player);

    callisto.trade(player2);
    runAllActions(game);

    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
    expect(player.energy).to.eq(3);
    expect(player2.energy).to.eq(2);
  });
});
