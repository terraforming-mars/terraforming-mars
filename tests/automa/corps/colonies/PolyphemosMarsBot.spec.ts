import {expect} from 'chai';
import {PolyphemosMarsBot} from '@/server/automa/corps/colonies/PolyphemosMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('PolyphemosMarsBot', () => {
  it('gains 25 M€ at setup and discards a project card before the action phase', () => {
    const {marsBot, calls} = recordingMarsBot();
    const corp = new PolyphemosMarsBot();

    corp.setup(marsBot);
    corp.beforeActionPhase(marsBot);

    expect(calls).deep.eq(['gainMc(25)', 'maybeDiscardProjectCardWithFewestTags()']);
  });
});
