import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Promoter} from '@/server/awards/arabiaTerra/Promoter';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Promoter', () => {
  it('MarsBot scores its Event track', () => {
    const marsBot = fakeMarsBot();
    setTrack(marsBot, Tag.EVENT, 4);

    expect(new Promoter().marsBotScore(marsBot)).eq(4);
  });
});
