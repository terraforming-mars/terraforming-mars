import {expect} from 'chai';
import {Comet} from '../../../src/cards/base/Comet';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayers} from '../../TestPlayers';

describe('Comet', function() {
  let card : Comet; let player : Player; let player2 : Player; let player3: Player; let game : Game;

  beforeEach(function() {
    card = new Comet();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.YELLOW.newPlayer();
    game = Game.newInstance('foobar', [player, player2, player3], player);
  });

  it('Should play', function() {
    player2.plants = 2;
    player3.plants = 4;

    card.play(player);
    expect(game.getTemperature()).to.eq(-28);
    expect(game.deferredActions).has.lengthOf(2);

    const selectSpace = game.deferredActions.pop()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(player.getTerraformRating()).to.eq(22);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);
  });

  it('Provides no options if there is nothing to confirm', function() {
    TestingUtils.maxOutOceans(player);
    player.plants = 8;

    card.play(player);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;

    expect(player.plants).to.eq(8); // self plants are not removed
    expect(game.getTemperature()).to.eq(-28);
  });

  it('Works fine in solo mode', function() {
    Game.newInstance('solo_game', [player], player);
    player.plants = 8;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.plants).to.eq(8);
  });
});
