import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {MiningExpedition} from '../../../src/server/cards/base/MiningExpedition';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('MiningExpedition', function() {
  let card: MiningExpedition;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new MiningExpedition();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 8;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(6);

    expect(player.steel).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
