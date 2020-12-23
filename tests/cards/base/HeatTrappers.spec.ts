import {expect} from 'chai';
import {HeatTrappers} from '../../../src/cards/base/HeatTrappers';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('HeatTrappers', function() {
  let card : HeatTrappers; let player : Player; let player2: Player; let game: Game;

  beforeEach(function() {
    card = new HeatTrappers();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should be playable in solo mode', function() {
    game = Game.newInstance('foobar', [player], player);
    player.addProduction(Resources.HEAT);

    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);

    expect(player.getProduction(Resources.HEAT)).to.eq(1); // Not changed
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1); // Incremented
  });

  it('Should play - auto select if single target', function() {
    player2.addProduction(Resources.HEAT, 7);
    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);

    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player2.getProduction(Resources.HEAT)).to.eq(5);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.HEAT, 3);
    player2.addProduction(Resources.HEAT, 7);
    card.play(player, game);

    expect(player.getProduction(Resources.ENERGY)).to.eq(1);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.HEAT)).to.eq(5);
  });

  it('Can\'t play if nobody has heat production', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Gives victory points', function() {
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
  });
});
