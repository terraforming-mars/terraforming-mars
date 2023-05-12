import {expect} from 'chai';
import {OreProcessor} from '../../../src/server/cards/base/OreProcessor';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('OreProcessor', function() {
  let card: OreProcessor;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new OreProcessor();
    [game, player] = testGame(2);
  });

  it('Can not act', function() {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 4;
    expect(card.canAct(player)).is.true;
    card.action(player);

    expect(player.energy).to.eq(0);
    expect(player.titanium).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
