import {expect} from 'chai';
import {Triton} from '../../src/server/colonies/Triton';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Triton', () => {
  let triton: Triton;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    triton = new Triton();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(triton);
  });

  it('Should build', () => {
    triton.addColony(player);
    expect(player.titanium).to.eq(3);
  });

  it('Should trade', () => {
    triton.trade(player);
    expect(player.titanium).to.eq(1);
    expect(player2.titanium).to.eq(0);
  });

  it('Should give trade bonus', () => {
    triton.addColony(player);

    triton.trade(player2);
    runAllActions(game);

    expect(player.titanium).to.eq(4);
    expect(player2.titanium).to.eq(1);
  });
});
