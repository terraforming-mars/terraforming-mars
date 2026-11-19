import {expect} from 'chai';
import {VironMarsBot} from '@/server/automa/corps/venusNext/VironMarsBot';
import {Birds} from '@/server/cards/base/Birds';
import {Decomposers} from '@/server/cards/base/Decomposers';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('VironMarsBot', () => {
  // A blue card with a red arrow is an active card with an action
  it('adds a floater and scores a VP for each active card with an action', () => {
    const {marsBot, calls} = recordingMarsBot();
    const corp = new VironMarsBot();

    corp.onProjectCardResolved(marsBot, new Birds());
    corp.onProjectCardResolved(marsBot, new Decomposers());

    expect(calls).deep.eq(['addFloaters(1)']);
    expect(corp.vpBonus(marsBot)).eq(1);
  });
});
