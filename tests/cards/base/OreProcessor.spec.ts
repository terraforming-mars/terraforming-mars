import {expect} from 'chai';
import {OreProcessor} from '../../../src/server/cards/base/OreProcessor';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('OreProcessor', () => {
  let card: OreProcessor;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new OreProcessor();
    [game, player] = testGame(2);
  });

  it('Can not act', () => {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 4;
    expect(card.canAct(player)).is.true;
    card.action(player);

    expect(player.energy).to.eq(0);
    expect(player.titanium).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });

  it('Logs the energy it spends', () => {
    player.energy = 4;
    card.action(player);

    const spent = game.gameLog.find((m) => m.message === '${0} lost ${1} ${2}');
    expect(spent?.data.slice(1).map((d) => d.value)).deep.eq(['4', 'energy']);
  });
});
