import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Miner} from '@/server/awards/Miner';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Miner', () => {
  it('MarsBot scores its Space track plus 5', () => {
    const marsBot = fakeMarsBot();
    setTrack(marsBot, Tag.SPACE, 3);

    expect(new Miner().marsBotScore(marsBot)).eq(8);
  });
});
