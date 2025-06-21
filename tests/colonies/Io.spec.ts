import {expect} from 'chai';
import {Io} from '../../src/server/colonies/Io';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Io', () => {
  let io: Io;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    io = new Io();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(io);
  });

  it('Should build', () => {
    io.addColony(player);
    expect(player.production.heat).to.eq(1);
    expect(player2.production.heat).to.eq(0);
  });

  it('Should trade', () => {
    io.trade(player);
    expect(player.heat).to.eq(3);
    expect(player2.heat).to.eq(0);
  });

  it('Should give trade bonus', () => {
    io.addColony(player);

    io.trade(player2);
    runAllActions(game);

    expect(player.production.heat).to.eq(1);
    expect(player2.production.heat).to.eq(0);
    expect(player.heat).to.eq(2);
    expect(player2.heat).to.eq(3);
  });
});
