import {expect} from 'chai';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {FactorumMarsBot} from '@/server/automa/corps/promo/FactorumMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const BUILDING = 0;

describe('FactorumMarsBot', () => {
  it('stores 1 M€ for each advance of the building track and none for another track', () => {
    const {marsBot, corpState} = recordingMarsBot();
    const corp = new FactorumMarsBot();

    corp.onTrackCubeTrigger(marsBot, BUILDING, 1, 'white');
    corp.onTrackCubeTrigger(marsBot, BUILDING, 2, 'white');
    corp.onTrackCubeTrigger(marsBot, 1, 1, 'white');

    expect(corpState.get('mcOnCard')).eq(2);
  });

  it('has a white cube on every space of the building track, and Supply and Demand as its action deck bonus card', () => {
    expect(trackCubes(new FactorumMarsBot())).deep.eq(Array.from({length: 18}, (_, i) => `building white ${i + 1}`));
    expect(new FactorumMarsBot().trackCubesTriggerEveryAdvance).is.true;
    expect(new FactorumMarsBot().actionDeckBonusCard).eq(BonusCardId.B24_SUPPLY_AND_DEMAND);
  });
});
