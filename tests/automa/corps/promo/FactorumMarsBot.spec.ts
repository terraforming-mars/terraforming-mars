import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {FactorumMarsBot} from '@/server/automa/corps/promo/FactorumMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('FactorumMarsBot', () => {
  it('stores 1 M€ for each advance of the building track and none for another track', () => {
    const {marsBot, corpState} = recordingMarsBot();
    const corp = new FactorumMarsBot();

    corp.onTrackCubeTrigger(marsBot, TRACK.building, 1, 'white');
    corp.onTrackCubeTrigger(marsBot, TRACK.building, 2, 'white');
    corp.onTrackCubeTrigger(marsBot, TRACK.space, 1, 'white');

    expect(corpState.get('mcOnCard')).eq(2);
  });

  it('has a white cube on every space of the building track, and Supply and Demand as its action deck bonus card', () => {
    const expectedCubes = Array.from({length: 18}, (_, i) => `building white ${i + 1}`);

    expect(trackCubes(new FactorumMarsBot())).deep.eq(expectedCubes);
    expect(new FactorumMarsBot().trackCubesTriggerEveryAdvance).is.true;
    expect(new FactorumMarsBot().actionDeckBonusCard).eq(BonusCardName.SUPPLY_AND_DEMAND);
  });
});
