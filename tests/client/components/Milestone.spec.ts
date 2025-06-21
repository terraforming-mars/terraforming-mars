import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import Milestone from '@/client/components/Milestone.vue';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';
import {getMilestone} from '@/client/MilestoneAwardManifest';

function createMilestone(
  {claimed, scores = []}:
  {claimed: boolean, scores?: ClaimedMilestoneModel['scores']},
): ClaimedMilestoneModel {
  return {
    name: 'Builder',
    playerName: claimed ? 'Bob' : undefined,
    playerColor: claimed ? 'red': undefined,
    scores,
  };
}

describe('Milestone', () => {
  it('shows passed milestone', () => {
    const milestone = createMilestone({claimed: false});
    const wrapper = mount(Milestone, {
      localVue: getLocalVue(),
      propsData: {milestone},
    });

    expect(wrapper.text()).to.include(milestone.name);
  });

  it('does not show milestone description', () => {
    const milestone = createMilestone({claimed: false});
    const wrapper = mount(Milestone, {
      localVue: getLocalVue(),
      propsData: {milestone},
    });

    const expected = getMilestone('Builder').description;
    expect(wrapper.text()).to.not.include(expected);
  });

  const showScoresRuns = [
    {value: undefined, expected: true},
    {value: true, expected: true},
    {value: false, expected: false},
  ] as const;
  for (const run of showScoresRuns) {
    it('Show scores ' + run.value, () => {
      const milestone = createMilestone({claimed: true, scores: [{playerColor: 'red', playerScore: 2}]});
      const wrapper = mount(Milestone, {localVue: getLocalVue(), propsData: {milestone, showScores: run.value}});

      expect(wrapper.find('[data-test=player-score]').exists()).to.eq(run.expected);
    });
  }

  it('colors player score', () => {
    const milestone = createMilestone({
      claimed: true,
      scores: [
        {playerColor: 'red', playerScore: 2},
      ],
    });

    const wrapper = mount(Milestone, {localVue: getLocalVue(), propsData: {milestone, showScores: true}});

    const scoreWrapper = wrapper.find('[data-test=player-score]');
    expect(scoreWrapper.classes()).to.includes(`player_bg_color_${milestone.scores[0].playerColor}`);
  });

  it('shows sorted players scores', () => {
    const milestone = createMilestone({
      claimed: false,
      scores: [
        {playerColor: 'red', playerScore: 2},
        {playerColor: 'blue', playerScore: 4},
        {playerColor: 'yellow', playerScore: 0},
        {playerColor: 'green', playerScore: 4},
      ],
    });

    const wrapper = mount(Milestone, {localVue: getLocalVue(), propsData: {milestone, showScoresRuns: true}});

    const scores = wrapper.findAll('[data-test=player-score]')
      .wrappers.map((scoreWrapper) => parseInt(scoreWrapper.text()));

    expect(scores).to.be.deep.eq([4, 4, 2, 0]);
  });

  it('shows player cube if milestone is claimed', () => {
    const milestone = createMilestone({claimed: true});
    const wrapper = mount(Milestone, {localVue: getLocalVue(), propsData: {milestone}});

    expect(wrapper.find(`.board-cube--${milestone.playerColor}`).exists()).to.be.true;
  });

  it('creates correct css class from milestone name', () => {
    const milestone = createMilestone({claimed: true});
    const wrapper = mount(Milestone, {localVue: getLocalVue(), propsData: {milestone}});

    expect(wrapper.find('.ma-name--builder').exists()).to.be.true;
  });
});
