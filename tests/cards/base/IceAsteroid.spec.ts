import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {testGame} from '../../TestGame';
import {cast, maxOutOceans, testRedsCosts} from '../../TestingUtils';

describe('IceAsteroid', () => {
  it('Should play', () => {
    const card = new IceAsteroid();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
  });

  const redsRuns = [
    {oceans: 0, expected: 6},
    {oceans: 7, expected: 6},
    {oceans: 8, expected: 3},
    {oceans: 9, expected: 0},
  ] as const;

  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const card = new IceAsteroid();
      const [/* game */, player, player2] = testGame(2, {turmoilExtension: true});
      maxOutOceans(player2, run.oceans);
      testRedsCosts(() => player.canPlay(card), player, card.cost, run.expected);
    });
  }
});
