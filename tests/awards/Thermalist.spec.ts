import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Thermalist} from '@/server/awards/Thermalist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Thermalist', () => {
  it('MarsBot scores its Energy track plus 5', () => {
    const marsBot = fakeMarsBot();
    setTrack(marsBot, Tag.POWER, 3);

    expect(new Thermalist().marsBotScore(marsBot)).eq(8);
  });
});
