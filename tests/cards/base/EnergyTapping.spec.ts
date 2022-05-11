import {expect} from 'chai';
import {EnergyTapping} from '../../../src/cards/base/EnergyTapping';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('EnergyTapping', function() {
  let card : EnergyTapping; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new EnergyTapping();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    player.popWaitingFor();
  });

  it('Should play - auto select if single target', function() {
    card.play(player);
    player2.setProductionForTest({energy: 1});
    TestingUtils.runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.ENERGY, 2);
    player2.addProduction(Resources.ENERGY, 3);

    card.play(player);

    TestingUtils.runAllActions(game);
    const selectPlayer = TestingUtils.cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);

    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
  });

  it('Playable in solo mode', function() {
    const game = Game.newInstance('foobar', [player], player);
    player.popWaitingFor(); // Eliminate SelectInitialCards
    card.play(player);

    TestingUtils.runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;

    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(-1);
  });
});
