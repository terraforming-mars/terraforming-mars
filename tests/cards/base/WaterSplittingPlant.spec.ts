import {expect} from 'chai';
import {WaterSplittingPlant} from '../../../src/server/cards/base/WaterSplittingPlant';
import {IGame} from '../../../src/server/IGame';
import {maxOutOceans, setOxygenLevel, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('WaterSplittingPlant', function() {
  let card: WaterSplittingPlant;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new WaterSplittingPlant();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', function() {
    maxOutOceans(player, 2);
    expect(card.canPlay(player)).is.true;
  });

  it('Can not act', function() {
    player.energy = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 3;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(game.getOxygenLevel()).to.eq(1);
  });

  const redsRuns = [
    {oxygen: 12, expected: 3},
    {oxygen: 13, expected: 3},
    {oxygen: 14, expected: 0},
  ] as const;

  // canAct needs bespoke behavior, or better behavior in the execu
  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});

      // Card requirements
      player.energy = 3;
      maxOutOceans(player, 2);

      setOxygenLevel(game, run.oxygen);
      testRedsCosts(() => card.canAct(player), player, 0, run.expected);
    });
  }
});
