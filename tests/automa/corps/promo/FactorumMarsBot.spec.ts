import {expect} from 'chai';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {FACTORUM_MARSBOT_CORP} from '@/server/automa/corps/promo/FactorumMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track indexes on the Tharsis board
const BUILDING = 0;
const SPACE = 1;

describe('FactorumMarsBot', () => {
  it('stores 1 M€ for each advance of the building track and none for another track', () => {
    const {marsBot, corpState} = recordingMarsBot();
    const onCube = FACTORUM_MARSBOT_CORP.effect!.onTrackCubeTrigger!;

    onCube(marsBot, BUILDING, 1, 'white');
    onCube(marsBot, BUILDING, 2, 'white');
    onCube(marsBot, SPACE, 1, 'white');

    expect(corpState.get('mcOnCard')).eq(2);
  });

  it('has a white cube on every space of the building track, and Supply and Demand as its action deck bonus card', () => {
    expect(trackCubes(FACTORUM_MARSBOT_CORP)).deep.eq(Array.from({length: 18}, (_, i) => `building white ${i + 1}`));
    expect(FACTORUM_MARSBOT_CORP.trackCubesTriggerEveryAdvance).is.true;
    expect(FACTORUM_MARSBOT_CORP.actionDeckBonusCard).eq(BonusCardId.B24_SUPPLY_AND_DEMAND);
  });
});
