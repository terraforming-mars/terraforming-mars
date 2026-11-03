import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Banker} from '@/server/awards/Banker';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Banker', () => {
  it('MarsBot scores its Building and Event tracks together', () => {
    const bot = fakeMarsBot();
    setTrack(bot, Tag.BUILDING, 3);
    setTrack(bot, Tag.EVENT, 2);

    expect(new Banker().marsBotScore(bot)).eq(5);
  });
});
