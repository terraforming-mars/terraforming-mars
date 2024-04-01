import {IceMoonColony} from '../../../src/server/cards/colonies/IceMoonColony';
import {testGame} from '../../TestGame';
import {cast, maxOutOceans, runAllActions, testRedsCosts} from '../../TestingUtils';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('IceMoonColony', () => {
  it('play', () => {
    const card = new IceMoonColony();
    // 2 players to remove an early-game solo action in the deferred actions queue.
    const [game, player] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        // The important thing is that Europa is absent.
        ColonyName.GANYMEDE,
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.TITAN,
        ColonyName.TRITON],
    });

    cast(card.play(player), undefined);
    runAllActions(game);

    UnderworldTestHelper.assertBuildColony(player, player.popWaitingFor());

    runAllActions(game);

    UnderworldTestHelper.assertPlaceOcean(player, player.popWaitingFor());

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
  });


  const redsRuns = [
    {oceans: 0, expected: 3},
    {oceans: 8, expected: 3},
    {oceans: 9, expected: 0},
  ] as const;

  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const card = new IceMoonColony();
      const [/* game */, player, player2] = testGame(2, {coloniesExtension: true, turmoilExtension: true});
      maxOutOceans(player2, run.oceans);
      testRedsCosts(() => player.canPlay(card), player, card.cost, run.expected);
    });
  }
});
