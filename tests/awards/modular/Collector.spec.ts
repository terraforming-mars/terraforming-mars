import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Collector} from '@/server/awards/modular/Collector';
import {fakeMarsBot, setAllTracks, setTrack} from '../../automa/FakeMarsBot';

describe('Collector', () => {
  it('MarsBot counts its tracks that reached space 3', () => {
    const bot = fakeMarsBot();
    setAllTracks(bot, 2);
    setTrack(bot, Tag.BUILDING, 3);
    setTrack(bot, Tag.SPACE, 3);
    setTrack(bot, Tag.PLANT, 7);

    expect(new Collector().marsBotScore(bot)).eq(3);
  });
});
