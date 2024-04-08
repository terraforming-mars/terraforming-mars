import {expect} from 'chai';
import {Mangrove} from '../../../src/server/cards/base/Mangrove';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {runAllActions, setOxygenLevel, setTemperature, testRedsCosts} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('Mangrove', function() {
  let card: Mangrove;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Mangrove();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
    setTemperature(game, 2);
    expect(card.canPlay(player)).is.not.true;
    setTemperature(game, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);

    UnderworldTestHelper.assertPlaceTile(player, player.popWaitingFor(), TileType.GREENERY);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });


  const redsRuns = [
    {oxygen: 12, expected: 3},
    {oxygen: 13, expected: 3},
    {oxygen: 14, expected: 0},
  ] as const;

  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});

      // Card requirement
      setTemperature(game, 4);

      setOxygenLevel(game, run.oxygen);
      testRedsCosts(() => player.canPlay(card), player, card.cost, run.expected);
    });
  }
});
