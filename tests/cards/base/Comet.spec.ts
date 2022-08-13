import {expect} from 'chai';
import {Comet} from '../../../src/server/cards/base/Comet';
import {Game} from '../../../src/server/Game';
import {cast, maxOutOceans} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('Comet', function() {
  let card: Comet;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Comet();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    player3 = TestPlayer.YELLOW.newPlayer();
    game = Game.newInstance('gameid', [player, player2, player3], player);
  });

  it('Should play', function() {
    player2.plants = 2;
    player3.plants = 4;

    card.play(player);
    expect(game.getTemperature()).to.eq(-28);
    expect(game.deferredActions).has.lengthOf(2);

    const selectSpace = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(player.getTerraformRating()).to.eq(22);

    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);
  });

  it('Provides no options if there is nothing to confirm', function() {
    maxOutOceans(player);
    player.plants = 8;

    card.play(player);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;

    expect(player.plants).to.eq(8); // self plants are not removed
    expect(game.getTemperature()).to.eq(-28);
  });

  it('Works fine in solo mode', function() {
    Game.newInstance('gameid', [player], player);
    player.plants = 8;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.plants).to.eq(8);
  });
});
