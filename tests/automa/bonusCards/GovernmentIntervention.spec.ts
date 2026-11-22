import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {GovernmentIntervention} from '@/server/automa/bonusCards/GovernmentIntervention';
import {testGame} from '../../TestGame';
import {setVenusScaleLevel} from '../../TestingUtils';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

const ADVANCE_FURTHEST = `advanceFurthestParameter(${BonusCardName.GOVERNMENT_INTERVENTION}, false)`;

describe('GovernmentIntervention', () => {
  // `advanced` is what raising the parameter furthest from completion returns: false once Mars is complete
  for (const run of [
    {generation: 2, venus: 0, advanced: true, expected: {calls: ['withoutTRorMcGain()', ADVANCE_FURTHEST], venusAfter: 0}},
    {generation: 3, venus: 0, advanced: true, expected: {calls: ['withoutTRGain()'], venusAfter: 2}},
    {generation: 3, venus: 30, advanced: true, expected: {calls: ['withoutTRorMcGain()', ADVANCE_FURTHEST], venusAfter: 30}},
    {generation: 2, venus: 0, advanced: false, expected: {calls: ['withoutTRorMcGain()', ADVANCE_FURTHEST, 'withoutTRGain()'], venusAfter: 2}},
  ] as const) {
    it('raises a Martian parameter on an even generation or with Venus complete, else Venus, for no TR or M€: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2, {venusNextExtension: true});
      const {marsBot, calls} = recordingMarsBot({
        game, player: botPlayer, humanPlayer: human, megacredits: 0, interceptsParameterRaise: () => false,
        advanceFurthestParameter: (cardName, allowCorpIntercept) => {
          calls.push(`advanceFurthestParameter(${cardName}, ${allowCorpIntercept})`);
          return run.advanced;
        },
      });
      game.generation = run.generation;
      setVenusScaleLevel(game, run.venus);

      new GovernmentIntervention().resolve(marsBot);

      expect(calls).deep.eq(run.expected.calls);
      expect(game.getVenusScaleLevel()).eq(run.expected.venusAfter);
    });
  }
});
