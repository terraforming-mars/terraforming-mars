import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {RobinsonIndustriesMarsBot} from '@/server/automa/corps/prelude/RobinsonIndustriesMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('RobinsonIndustriesMarsBot', () => {
  it('gains 10 M€ at setup, and Diversification is its action deck bonus card', () => {
    const {marsBot, calls} = recordingMarsBot();

    new RobinsonIndustriesMarsBot().setup(marsBot);

    expect(calls).deep.eq(['gainMc(10)']);
    expect(new RobinsonIndustriesMarsBot().actionDeckBonusCard).eq(BonusCardName.DIVERSIFICATION);
  });
});
