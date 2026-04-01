
import {expect} from 'chai';
import {Algae} from '../src/server/cards/base/Algae';
import {Ants} from '../src/server/cards/base/Ants';
import {Birds} from '../src/server/cards/base/Birds';
import {Game} from '../src/server/Game';
import {LogHelper} from '../src/server/LogHelper';
import {TestPlayer} from './TestPlayer';
import {LogMessageDataType} from '../src/common/logs/LogMessageDataType';
import {toName} from '../src/common/utils/utils';

describe('LogHelper', () => {
  const player1 = TestPlayer.BLUE.newPlayer();
  const player2 = TestPlayer.RED.newPlayer();
  const algae = new Algae();
  const ants = new Ants();
  const birds = new Birds();
  const game = Game.newInstance('gameid', [player1, player2], player1);

  it('logs no drawn cards ', () => {
    LogHelper.logDrawnCards(player1, []);
    const msg = game.gameLog.pop()!;
    msg.timestamp = 0;

    const expected = {
      message: '${0} drew no cards',
      data: [{type: LogMessageDataType.PLAYER, value: 'blue'}],
      playerId: undefined, timestamp: 0,
    };
    expect(msg).deep.eq(expected);
  });

  for (const run of [
    {cards: [algae], expected: ['Algae']},
    {cards: [algae, ants], expected: ['Algae', 'Ants']},
    {cards: [algae, ants, birds], expected: ['Algae', 'Ants', 'Birds']},
  ] as const) {
    it('logs drawn cards ' + JSON.stringify(run.cards.map(toName)), () => {
      LogHelper.logDrawnCards(player1, run.cards);
      const msg = game.gameLog.pop()!;
      msg.timestamp = 0;

      const expected = {
        message: '${0} drew ${1}',
        data: [
          {type: LogMessageDataType.PLAYER, value: 'blue'},
          {type: LogMessageDataType.CARDS, value: run.expected},
        ],
        playerId: undefined, timestamp: 0,
      };
      expect(msg).deep.eq(expected);
    });
  }

  it('logs drawn cards privately', () => {
    const player1 = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const card1 = new Algae();
    const game = Game.newInstance('gameid', [player1, player2], player1);
    LogHelper.logDrawnCards(player1, [card1], true);
    const msg = game.gameLog.pop()!;

    msg.timestamp = 0; // for testing.

    expect(msg).deep.eq({
      message: '${0} drew ${1}',
      data: [
        {type: LogMessageDataType.STRING, value: 'You'},
        {type: LogMessageDataType.CARDS, value: ['Algae']},
      ],
      timestamp: 0,
      playerId: 'p-blue-id',
    });
  });
});
