import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {marsBotAwardScore} from '@/server/automa/MarsBotMilestoneAwardEval';
import {Miner} from '@/server/awards/Miner';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Miner', () => {
  it('MarsBot scores its Space track plus 5', () => {
    const bot = fakeMarsBot();
    setTrack(bot, Tag.SPACE, 3);

    expect(marsBotAwardScore(new Miner(), bot)).eq(8);
  });
});
