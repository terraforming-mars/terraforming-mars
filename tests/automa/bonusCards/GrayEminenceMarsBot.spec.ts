import {expect} from 'chai';
import {GrayEminenceMarsBot} from '@/server/automa/bonusCards/GrayEminenceMarsBot';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('GrayEminenceMarsBot', () => {
  for (const run of [
    {reserve: 7, expected: {placed: 2, calls: []}},
    {reserve: 1, expected: {placed: 1, calls: ['gainMc(2)']}},
    {reserve: 0, expected: {placed: 0, calls: ['gainMc(2)', 'gainMc(2)']}},
  ] as const) {
    it('places 2 delegates, gaining 2 M€ for each it cannot place: ' + JSON.stringify(run), () => {
      const [game, human] = testGame(1, {automa: true, turmoilExtension: true});
      const botPlayer = game.marsBotPlayer!;
      const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
      const turmoil = Turmoil.getTurmoil(game);
      turmoil.delegateReserve.remove(botPlayer, turmoil.delegateReserve.get(botPlayer) - run.reserve);

      new GrayEminenceMarsBot().resolve(marsBot);

      expect(run.reserve - turmoil.delegateReserve.get(botPlayer)).eq(run.expected.placed);
      expect(calls).deep.eq(run.expected.calls);
    });
  }

  it('sends each delegate to a party with the fewest MarsBot delegates', () => {
    const [game, human] = testGame(1, {automa: true, turmoilExtension: true});
    const botPlayer = game.marsBotPlayer!;
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const turmoil = Turmoil.getTurmoil(game);
    for (const party of turmoil.parties.slice(2)) {
      turmoil.sendDelegateToParty(botPlayer, party.name, game);
    }

    new GrayEminenceMarsBot().resolve(marsBot);

    expect(turmoil.parties.map((party) => party.delegates.get(botPlayer))).deep.eq([1, 1, 1, 1, 1, 1]);
  });
});
