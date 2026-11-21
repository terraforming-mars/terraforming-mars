import {expect} from 'chai';
import {SupplyAndDemand} from '@/server/automa/bonusCards/SupplyAndDemand';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

describe('SupplyAndDemand', () => {
  for (const run of [
    {mcOnCard: 5, expected: {calls: ['gainMc(3)'], mcOnCardLeft: 2}},
    {mcOnCard: 2, expected: {calls: ['gainMc(2)'], mcOnCardLeft: 0}},
    {mcOnCard: 0, expected: {calls: [`maybeAdvanceTrack(${TRACK.power})`], mcOnCardLeft: 0}},
  ] as const) {
    it('takes up to 3 M€ from the corporation card, or advances the power track: ' + JSON.stringify(run), () => {
      const {marsBot, calls, corpState} = recordingMarsBot();
      corpState.set('mcOnCard', run.mcOnCard);

      new SupplyAndDemand().resolve(marsBot);

      expect(calls).deep.eq(run.expected.calls);
      expect(corpState.get('mcOnCard')).eq(run.expected.mcOnCardLeft);
    });
  }
});
