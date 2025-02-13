import {expect} from 'chai';
import {Luna} from '../../src/server/colonies/Luna';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Luna', () => {
  let luna: Luna;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    luna = new Luna();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(luna);
  });

  it('Should build', () => {
    luna.addColony(player);
    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(0);
  });

  it('Should trade', () => {
    luna.trade(player);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Should give trade bonus', () => {
    luna.addColony(player);

    luna.trade(player2);
    runAllActions(game);

    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(0);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(2);
  });
});
