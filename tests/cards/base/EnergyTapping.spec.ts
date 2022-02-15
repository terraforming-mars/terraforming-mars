import {expect} from 'chai';
import {EnergyTapping} from '../../../src/cards/base/EnergyTapping';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('EnergyTapping', function() {
  let card : EnergyTapping; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new EnergyTapping();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play - auto select if single target', function() {
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player2.addProduction(Resources.ENERGY, 3);

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(game.deferredActions).has.lengthOf(1);

    const selectPlayer = game.deferredActions.peek()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
  });

  it('Playable in solo mode', function() {
    Game.newInstance('foobar', [player], player);
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(-1);
  });
});
