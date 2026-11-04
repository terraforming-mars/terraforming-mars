import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {AZoologist} from '@/server/awards/amazonisPlanitia/AZoologist';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('AZoologist', () => {
  it('MarsBot scores its Bio track plus 5', () => {
    const bot = fakeMarsBot();
    setTrack(bot, Tag.PLANT, 3);

    expect(new AZoologist().marsBotScore(bot)).eq(8);
  });
});
