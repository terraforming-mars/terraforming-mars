import {expect} from 'chai';
import {OreProcessor} from '../../../src/server/cards/base/OreProcessor';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('OreProcessor', function() {
  let card: OreProcessor;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new OreProcessor();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
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
