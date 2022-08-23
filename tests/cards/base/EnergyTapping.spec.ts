import {expect} from 'chai';
import {EnergyTapping} from '../../../src/server/cards/base/EnergyTapping';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {runAllActions, cast} from '../../TestingUtils';

describe('EnergyTapping', function() {
  let card: EnergyTapping;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new EnergyTapping();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    player.popWaitingFor();
  });

  it('Should play - auto select if single target', function() {
    card.play(player);
    player2.production.override({energy: 1});
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player.production.add(Resources.ENERGY, 2);
    player2.production.add(Resources.ENERGY, 3);

    card.play(player);

    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);

    runAllActions(game);

    expect(player.production.energy).to.eq(3);
    expect(player2.production.energy).to.eq(2);
  });

  it('Playable in solo mode', function() {
    const game = Game.newInstance('gameid', [player], player);
    player.popWaitingFor(); // Eliminate SelectInitialCards
    card.play(player);

    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;

    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(-1);
  });
});
