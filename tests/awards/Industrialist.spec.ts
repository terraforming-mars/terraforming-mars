import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Industrialist} from '@/server/awards/Industrialist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Industrialist', () => {
  it('MarsBot scores its Energy track plus 5', () => {
    const bot = fakeMarsBot();
    setTrack(bot, Tag.POWER, 3);

    expect(new Industrialist().marsBotScore(bot)).eq(8);
  });
});
