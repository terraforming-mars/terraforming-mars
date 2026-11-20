import {expect} from 'chai';
import {SupplyAndDemandMarsBot} from '@/server/automa/bonusCards/SupplyAndDemandMarsBot';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

describe('SupplyAndDemandMarsBot', () => {
  for (const run of [
    {mcOnCard: 5, calls: ['gainMc(3)'], mcOnCardLeft: 2},
    {mcOnCard: 2, calls: ['gainMc(2)'], mcOnCardLeft: 0},
    {mcOnCard: 0, calls: [`maybeAdvanceTrack(${TRACK.power})`], mcOnCardLeft: 0},
  ] as const) {
    it('takes up to 3 M€ from the corporation card, or advances the power track: ' + JSON.stringify(run), () => {
      const {marsBot, calls, corpState} = recordingMarsBot();
      corpState.set('mcOnCard', run.mcOnCard);

      new SupplyAndDemandMarsBot().resolve(marsBot);

      expect(calls).deep.eq(run.calls);
      expect(corpState.get('mcOnCard')).eq(run.mcOnCardLeft);
    });
  }
});
