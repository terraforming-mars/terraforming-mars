import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {marsBotAwardScore, marsBotCanClaimMilestone} from '@/server/automa/MarsBotMilestoneAwardEval';
import {Banker} from '@/server/awards/Banker';
import {Scientist} from '@/server/awards/Scientist';
import {Builder} from '@/server/milestones/Builder';
import {Planner} from '@/server/milestones/Planner';
import {fakeMarsBot, setAllTracks, setTrack} from './FakeMarsBot';

describe('MarsBotMilestoneAwardEval', () => {
  it('falls back to the ordinary rule for a class without an override', () => {
    const bot = fakeMarsBot();
    setTrack(bot, Tag.BUILDING, 8);
    setTrack(bot, Tag.SCIENCE, 4);

    expect(marsBotCanClaimMilestone(new Builder(), bot)).is.true;
    expect(marsBotAwardScore(new Scientist(), bot)).eq(4);
  });

  it('uses the override of a class that has one', () => {
    const bot = fakeMarsBot();
    setAllTracks(bot, 4);

    expect(marsBotCanClaimMilestone(new Planner(), bot)).is.true;
    expect(marsBotAwardScore(new Banker(), bot)).eq(8);
  });
});
