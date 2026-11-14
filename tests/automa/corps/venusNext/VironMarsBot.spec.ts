import {expect} from 'chai';
import {VIRON_MARSBOT_CORP} from '@/server/automa/corps/venusNext/VironMarsBot';
import {Birds} from '@/server/cards/base/Birds';
import {Decomposers} from '@/server/cards/base/Decomposers';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('VironMarsBot', () => {
  // C25: a blue card with a red arrow is an active card with an action
  it('adds a floater and scores a VP for each active card with an action', () => {
    const {marsBot, calls} = recordingMarsBot();
    const effect = VIRON_MARSBOT_CORP.effect!;

    effect.onProjectCardResolved!(marsBot, new Birds());
    effect.onProjectCardResolved!(marsBot, new Decomposers());

    expect(calls).deep.eq(['addFloaters(1)']);
    expect(effect.vpBonus!(marsBot)).eq(1);
  });
});
