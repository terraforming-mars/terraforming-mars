import {expect} from 'chai';
import {GiantIceAsteroid} from '../../../src/server/cards/base/GiantIceAsteroid';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, setTemperature, testRedsCosts} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GiantIceAsteroid', function() {
  let card: GiantIceAsteroid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new GiantIceAsteroid();
    [game, player, player2, player3] = testGame(3);
  });

  it('Should play', function() {
    player2.plants = 4;
    player3.plants = 6;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(3);

    const firstOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    firstOcean.cb(firstOcean.spaces[0]);
    const secondOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    secondOcean.cb(secondOcean.spaces[1]);

    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    expect(orOptions.options).has.lengthOf(3);

    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);

    orOptions.options[1].cb();
    expect(player3.plants).to.eq(0);

    expect(game.getTemperature()).to.eq(-26);
    expect(player.getTerraformRating()).to.eq(24);
  });

  const redsRuns = [
    {oceans: 0, temperature: 4, expected: 12},
    {oceans: 7, temperature: 4, expected: 12},
    {oceans: 8, temperature: 4, expected: 9},
    {oceans: 9, temperature: 4, expected: 6},
    {oceans: 0, temperature: 6, expected: 9},
    {oceans: 0, temperature: 8, expected: 6},
    {oceans: 8, temperature: 8, expected: 3},
    {oceans: 9, temperature: 8, expected: 0},

    // Just a reminder that moving the temperature above 0 has effects.
    {oceans: 0, temperature: -2, expected: 15},
  ] as const;

  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const [game, player, player2] = testGame(2, {turmoilExtension: true});
      maxOutOceans(player2, run.oceans);
      setTemperature(game, run.temperature);
      testRedsCosts(() => player.canPlay(card), player, card.cost, run.expected);
    });
  }
});
