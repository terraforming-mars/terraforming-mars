import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {RemoveAnyPlants} from '../../src/server/deferredActions/RemoveAnyPlants';
import {ProtectedHabitats} from '../../src/server/cards/base/ProtectedHabitats';
import {BotanicalExperience} from '../../src/server/cards/pathfinders/BotanicalExperience';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {cast, formatMessage} from '../TestingUtils';
import {SelectOption} from '../../src/server/inputs/SelectOption';

describe('RemoveAnyPlants', () => {
  let player: TestPlayer;
  let target: TestPlayer;

  beforeEach(() => {
    [/* game */, player, target] = testGame(3);
  });

  it('no plants', () => {
    // Nobody has plants, so the caller isn't asked to do anything.
    cast(new RemoveAnyPlants(player, 2).execute(), undefined);
  });

  const executeRuns = [
    {plants: [0, 5], count: 2, options: 2, selected: 0, expected: [0, 3]},
    {plants: [0, 5], count: 2, options: 2, selected: 1, expected: [0, 5]},
    {plants: [0, 5], count: 7, options: 2, selected: 0, expected: [0, 0]},
    {plants: [5, 5], count: 2, options: 3, selected: 0, expected: [5, 3]},
    {plants: [5, 5], count: 2, options: 3, selected: 1, expected: [5, 5]},
    {plants: [5, 5], count: 2, options: 3, selected: 2, expected: [3, 5]},
  ] as const;
  for (const run of executeRuns) {
    it('execute ' + JSON.stringify(run), () => {
      player.plants = run.plants[0];
      target.plants = run.plants[1];
      const orOptions = cast(new RemoveAnyPlants(player, run.count).execute(), OrOptions);

      expect(orOptions.options).has.length(run.options);
      expect(formatMessage(orOptions.options[0].title)).matches(/Remove . plants from red/);
      expect(formatMessage(orOptions.options[1].title)).eq('Skip removing plants');
      if (run.options === 3) {
        const selectOption = cast(orOptions.options[2], SelectOption);
        expect(formatMessage(selectOption.title)).matches(/Remove . plants from blue/);
        expect(selectOption.warnings).contains('removeOwnPlants');
      }
      orOptions.options[run.selected].cb();
      expect(player.plants).eq(run.expected[0]);
      expect(target.plants).eq(run.expected[1]);
    });
  }

  it('Protected Habitats', () => {
    target.plants = 10;
    target.playedCards.push(new ProtectedHabitats());
    cast(new RemoveAnyPlants(player, 4).execute(), undefined);
    expect(target.plants).eq(10);
  });

  it('Botanical Experience', () => {
    target.plants = 10;
    target.playedCards.push(new BotanicalExperience());
    const orOptions = cast(new RemoveAnyPlants(player, 4).execute(), OrOptions);
    const option = orOptions.options[0];
    expect(formatMessage(option.title)).eq('Remove 2 plants from red');
    option.cb();
    expect(target.plants).eq(8);
  });
});
