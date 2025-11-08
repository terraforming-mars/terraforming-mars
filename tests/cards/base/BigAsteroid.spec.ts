import {expect} from 'chai';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('BigAsteroid', () => {
  let card: BigAsteroid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BigAsteroid();
    [game, player, player2] = testGame(2);
  });

  it('Should play', () => {
    player2.plants = 5;
    card.play(player);
    runAllActions(game);

    const orOptions = cast(player.getWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // do nothing
    expect(player2.plants).to.eq(5);

    orOptions.options[0].cb(); // remove plants
    expect(player2.plants).to.eq(1);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.titanium).to.eq(4);
  });

  it('Works fine in solo', () => {
    const [game, player] = testGame(1);
    player.plants = 5;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;

    expect(player.plants).to.eq(5);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.titanium).to.eq(4);
  });
});
