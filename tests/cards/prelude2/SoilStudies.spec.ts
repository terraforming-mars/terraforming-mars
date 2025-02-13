import {expect} from 'chai';
import {SoilStudies} from '../../../src/server/cards/prelude2/SoilStudies';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {setTemperature} from '../../TestingUtils';
import {Luna} from '../../../src/server/colonies/Luna';
import {testGame} from '../../TestGame';
import {range} from '../../../src/common/utils/utils';

describe('SoilStudies', () => {
  let card: SoilStudies;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new SoilStudies();
    [game, player] = testGame(1);
  });

  it('Can not play', () => {
    setTemperature(game, -2);
    expect(card.canPlay(player)).is.not.true;
  });

  const playRuns = [
    {tags: undefined, colonies: 0, expected: 1},
    {tags: {microbe: 1}, colonies: 0, expected: 1},
    {tags: {venus: 1}, colonies: 0, expected: 2},
    {tags: {wild: 1}, colonies: 0, expected: 2},
    {tags: {plant: 1}, colonies: 0, expected: 2},
    {tags: undefined, colonies: 1, expected: 2},
    {tags: undefined, colonies: 2, expected: 3},
    {tags: {venus: 4, plant: 2, microbe: 2, wild: 1}, colonies: 1, expected: 9},
  ] as const;
  for (const run of playRuns) {
    it('Play ' + JSON.stringify(run), () => {
      player.tagsForTest = run.tags;

      const colony = new Luna();
      game.colonies.push(colony);
      for (const _ of range(run.colonies)) {
        colony.colonies.push(player.id);
      }

      card.play(player);
      expect(player.plants).eq(run.expected);
    });
  }
});
