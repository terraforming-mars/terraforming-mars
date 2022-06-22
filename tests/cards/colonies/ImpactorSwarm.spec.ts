import {expect} from 'chai';
import {ImpactorSwarm} from '../../../src/cards/colonies/ImpactorSwarm';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ImpactorSwarm', function() {
  let card : ImpactorSwarm; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new ImpactorSwarm();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play when no other player has plants', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.heat).to.eq(12);
  });

  it('Should be able to remove plants from other player', function() {
    player2.plants = 2;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);
    expect(player.heat).to.eq(12);
  });
});
