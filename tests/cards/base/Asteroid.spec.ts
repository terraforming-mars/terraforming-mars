import {expect} from 'chai';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Asteroid', function() {
  let card: Asteroid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Asteroid();
    [game, player, player2] = testGame(2);
  });

  it('Should play', function() {
    player2.plants = 2;
    card.play(player);
    runAllActions(game);

    const orOptions = cast(player.getWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // do nothing
    expect(player2.plants).to.eq(2);

    orOptions.options[0].cb(); // remove plants
    expect(player2.plants).to.eq(0);

    expect(player.titanium).to.eq(2);
    expect(game.getTemperature()).to.eq(-28);
  });
});
