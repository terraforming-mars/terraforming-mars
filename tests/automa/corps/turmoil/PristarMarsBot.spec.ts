import {expect} from 'chai';
import {PristarMarsBot} from '@/server/automa/corps/turmoil/PristarMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('PristarMarsBot', () => {
  it('skips the first raise of a global parameter for 1 TR and 6 M€, and lets the next one through', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();
    const corp = new PristarMarsBot();
    corpState.set('whiteCubeOnCard', 1);

    expect(corp.interceptGlobalParameterRaise(marsBot)).is.true;
    expect(corpState.get('whiteCubeOnCard')).eq(0);
    expect(calls).deep.eq(['raiseTR(1)', 'gainMc(6)']);

    expect(corp.interceptGlobalParameterRaise(marsBot)).is.false;
    expect(calls).deep.eq(['raiseTR(1)', 'gainMc(6)']);
  });

  it('puts the cube back before the action phase', () => {
    const {marsBot, corpState} = recordingMarsBot();
    corpState.set('whiteCubeOnCard', 0);

    new PristarMarsBot().beforeActionPhase(marsBot);

    expect(corpState.get('whiteCubeOnCard')).eq(1);
  });
});
