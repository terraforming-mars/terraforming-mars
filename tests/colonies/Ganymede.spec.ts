import {expect} from 'chai';
import {Ganymede} from '../../src/server/colonies/Ganymede';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Ganymede', () => {
  let ganymede: Ganymede;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    ganymede = new Ganymede();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(ganymede);
  });

  it('Should build', () => {
    ganymede.addColony(player);
    expect(player.production.plants).to.eq(1);
    expect(player2.production.plants).to.eq(0);
  });

  it('Should trade', () => {
    ganymede.trade(player);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(0);
  });

  it('Should give trade bonus', () => {
    ganymede.addColony(player);

    ganymede.trade(player2);
    runAllActions(game);

    expect(player.production.plants).to.eq(1);
    expect(player2.production.plants).to.eq(0);
    expect(player.plants).to.eq(1);
    expect(player2.plants).to.eq(1);
  });
});
