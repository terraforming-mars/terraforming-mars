import {expect} from 'chai';
import {EnergyTapping} from '../../../src/cards/base/EnergyTapping';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('EnergyTapping', function() {
  let card : EnergyTapping; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new EnergyTapping();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play - auto select if single target', function() {
    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player2.addProduction(Resources.ENERGY, 3);

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(game.deferredActions).has.lengthOf(1);

    const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
  });

  it('Playable in solo mode', function() {
    const game = Game.newInstance('foobar', [player], player);
    card.play(player, game);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
  });
});
