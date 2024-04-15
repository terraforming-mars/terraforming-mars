import {expect} from 'chai';
import {NuclearZone} from '../../../src/server/cards/base/NuclearZone';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions, setTemperature, testRedsCosts} from '../../TestingUtils';

describe('NuclearZone', function() {
  it('Should play', function() {
    const card = new NuclearZone();
    const [game, player] = testGame(2);
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(space.tile?.tileType).to.eq(TileType.NUCLEAR_ZONE);
    expect(card.getVictoryPoints(player)).to.eq(-2);
    expect(space.adjacency?.cost).eq(undefined);
    expect(game.getTemperature()).to.eq(-26);
  });

  const redsRuns = [
    {temperature: 2, expected: 6},
    {temperature: 6, expected: 3},
    {temperature: 8, expected: 0},
  ] as const;

  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const card = new NuclearZone();
      const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});
      setTemperature(game, run.temperature);
      testRedsCosts(() => player.canPlay(card), player, card.cost, run.expected);
    });
  }
});
