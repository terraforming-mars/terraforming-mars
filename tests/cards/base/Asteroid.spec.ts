import {expect} from 'chai';
import {Asteroid} from '../../../src/cards/base/Asteroid';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('Asteroid', function() {
  let card : Asteroid; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new Asteroid();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 2;
    card.play(player);
    TestingUtils.runAllActions(game);

    const orOptions = TestingUtils.cast(player.getWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // do nothing
    expect(player2.getResource(Resources.PLANTS)).to.eq(2);

    orOptions.options[0].cb(); // remove plants
    expect(player2.getResource(Resources.PLANTS)).to.eq(0);

    expect(player.titanium).to.eq(2);
    expect(game.getTemperature()).to.eq(-28);
  });
});
