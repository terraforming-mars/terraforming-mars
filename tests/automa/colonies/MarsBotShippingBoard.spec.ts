import {expect} from 'chai';
import {Phase} from '@/common/Phase';
import {Tag} from '@/common/cards/Tag';
import {ColonyName} from '@/common/colonies/ColonyName';
import {MarsBotShippingBoard} from '@/server/automa/colonies/MarsBotShippingBoard';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';

function shippingBoard() {
  const [game] = testGame(1);
  const advanced: Array<Tag> = [];
  const board = new MarsBotShippingBoard(fakeMarsBot({game, advanceTrackOfTag: (tag) => advanced.push(tag) > 0}));
  return {game, board, advanced};
}

describe('MarsBotShippingBoard', () => {
  for (const run of [
    {colonyName: ColonyName.CERES, amounts: [4], expected: {stored: 4, advanced: []}},
    {colonyName: ColonyName.CERES, amounts: [3, 2], expected: {stored: 0, advanced: [Tag.BUILDING]}},
    {colonyName: ColonyName.ENCELADUS, amounts: [12], expected: {stored: 2, advanced: [Tag.MICROBE, Tag.MICROBE]}},
    {colonyName: ColonyName.EUROPA, amounts: [5], expected: {stored: 0, advanced: []}},
    {colonyName: ColonyName.TITAN, amounts: [7], expected: {stored: 7, advanced: []}},
  ] as const) {
    it("advances the storage area's track for every 5 resources: " + JSON.stringify(run), () => {
      const {board, advanced} = shippingBoard();

      for (const amount of run.amounts) {
        board.add(run.colonyName, amount);
      }

      expect(board.get(run.colonyName)).eq(run.expected.stored);
      expect(advanced).deep.eq(run.expected.advanced);
    });
  }

  it('advances no track once the game is decided', () => {
    const {game, board, advanced} = shippingBoard();
    game.phase = Phase.END;

    board.add(ColonyName.CERES, 5);

    expect(board.get(ColonyName.CERES)).eq(5);
    expect(advanced).is.empty;
  });
});
