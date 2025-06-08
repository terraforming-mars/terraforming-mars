import {expect} from 'chai';
import {BreedingFarms} from '../../../src/server/cards/pathfinders/BreedingFarms';
import {Fish} from '../../../src/server/cards/base/Fish';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, testGame} from '../../TestingUtils';

describe('BreedingFarms', () => {
  let card: BreedingFarms;
  let player: TestPlayer;
  let fish: Fish;

  beforeEach(() => {
    card = new BreedingFarms();
    [/* game */, player] = testGame(1);
    fish = new Fish();
    player.popWaitingFor();
  });

  const canPlayRuns = [
    {tags: {}, expected: false},
    {tags: {science: 1}, expected: false},
    {tags: {animal: 1}, expected: false},
    {tags: {science: 1, animal: 1}, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      player.tagsForTest = run.tags;
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    expect(player.getTerraformRating()).eq(14);
    expect(player.game.getTemperature()).eq(-30);

    card.play(player);

    expect(player.getTerraformRating()).eq(15);
    expect(player.game.getTemperature()).eq(-28);
  });

  const canActRuns = [
    {plants: 0, card: false, expected: false},
    {plants: 1, card: false, expected: false},
    {plants: 0, card: true, expected: false},
    {plants: 1, card: true, expected: true},
  ] as const;
  for (const run of canActRuns) {
    it('Can act ' + JSON.stringify(run), () => {
      player.plants = run.plants;
      if (run.card) {
        player.playedCards.push(fish);
      }
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('act', () => {
    player.plants = 1;
    fish.resourceCount = 0;
    player.playedCards.push(fish);

    player.defer(card.action(player));
    runAllActions(player.game);
    player.getWaitingFor()?.cb([fish]);

    expect(player.plants).eq(0);
    expect(fish.resourceCount).eq(1);
  });
});
