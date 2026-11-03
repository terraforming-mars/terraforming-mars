import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Thermalist} from '@/server/awards/Thermalist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Thermalist', () => {
  it('MarsBot scores its Energy track plus 5', () => {
    const bot = fakeMarsBot();
    setTrack(bot, Tag.POWER, 3);

    expect(new Thermalist().marsBotScore(bot)).eq(8);
  });
});
