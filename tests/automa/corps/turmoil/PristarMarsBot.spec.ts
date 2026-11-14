import {expect} from 'chai';
import {GlobalParameter} from '@/common/GlobalParameter';
import {PRISTAR_MARSBOT_CORP} from '@/server/automa/corps/turmoil/PristarMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

// C36
describe('PristarMarsBot', () => {
  it('skips the first raise of a global parameter for 1 TR and 6 M€, and lets the next one through', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();
    const effect = PRISTAR_MARSBOT_CORP.effect!;
    corpState.set('whiteCubeOnCard', 1);

    expect(effect.interceptGlobalParameterRaise!(marsBot, GlobalParameter.TEMPERATURE)).is.true;
    expect(corpState.get('whiteCubeOnCard')).eq(0);
    expect(calls).deep.eq(['raiseTR(1)', 'gainMc(6)']);

    expect(effect.interceptGlobalParameterRaise!(marsBot, GlobalParameter.OXYGEN)).is.false;
    expect(calls).deep.eq(['raiseTR(1)', 'gainMc(6)']);
  });

  it('puts the cube back before the action phase', () => {
    const {marsBot, corpState} = recordingMarsBot();
    corpState.set('whiteCubeOnCard', 0);

    PRISTAR_MARSBOT_CORP.beforeActionPhase!(marsBot);

    expect(corpState.get('whiteCubeOnCard')).eq(1);
  });
});
