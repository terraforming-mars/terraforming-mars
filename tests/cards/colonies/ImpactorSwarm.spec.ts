import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ImpactorSwarm} from '../../../src/server/cards/colonies/ImpactorSwarm';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ImpactorSwarm', function() {
  let card: ImpactorSwarm;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new ImpactorSwarm();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
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

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);
    expect(player.heat).to.eq(12);
  });
});
