import {expect} from 'chai';
import {cast, maxOutOceans, setTemperature, testRedsCosts} from '../../TestingUtils';
import {LakeMarineris} from '../../../src/server/cards/base/LakeMarineris';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('LakeMarineris', () => {
  let card: LakeMarineris;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new LakeMarineris();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, 0);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(2);
    const firstOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    firstOcean.cb(firstOcean.spaces[0]);
    const secondOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    secondOcean.cb(secondOcean.spaces[1]);
    expect(player.getTerraformRating()).to.eq(22);

    expect(card.getVictoryPoints(player)).to.eq(2);
  });

  const redsRuns = [
    {oceans: 0, expected: 6},
    {oceans: 7, expected: 6},
    {oceans: 8, expected: 3},
    {oceans: 9, expected: 0},
  ] as const;

  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const card = new LakeMarineris();
      const [game, player, player2] = testGame(2, {turmoilExtension: true});

      // Card requirements.
      setTemperature(game, 0);

      maxOutOceans(player2, run.oceans);
      testRedsCosts(() => player.canPlay(card), player, card.cost, run.expected);
    });
  }
});
