import {expect} from 'chai';
import {Mangrove} from '../../../src/server/cards/base/Mangrove';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions, setOxygenLevel, setTemperature, testRedsCosts} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {assertPlaceTile} from '../../assertions';

describe('Mangrove', () => {
  let card: Mangrove;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Mangrove();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
    setTemperature(game, 2);
    expect(card.canPlay(player)).is.not.true;
    setTemperature(game, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    assertPlaceTile(player, player.popWaitingFor(), TileType.GREENERY);

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
