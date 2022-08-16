import {expect} from 'chai';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast} from '../../TestingUtils';

describe('Asteroid', function() {
  let card: Asteroid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Asteroid();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 2;
    card.play(player);
    runAllActions(game);

    const orOptions = cast(player.getWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // do nothing
    expect(player2.getResource(Resources.PLANTS)).to.eq(2);

    orOptions.options[0].cb(); // remove plants
    expect(player2.getResource(Resources.PLANTS)).to.eq(0);

    expect(player.titanium).to.eq(2);
    expect(game.getTemperature()).to.eq(-28);
  });
});
