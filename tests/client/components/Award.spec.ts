import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import Award from '@/client/components/Award.vue';
import {FundedAwardModel} from '@/common/models/FundedAwardModel';
import {getAward} from '@/client/MilestoneAwardManifest';

function createAward(
  {funded, scores = []}:
  {funded: boolean, scores?: FundedAwardModel['scores']},
): FundedAwardModel {
  return {
    name: `Cosmic Settler`,
    playerName: funded ? 'Bob' : undefined,
    playerColor: funded ? 'red': undefined,
    scores,
  };
}

describe('Award', () => {
  it('shows passed award', () => {
    const award = createAward({funded: false});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.text()).to.include(award.name);
  });

  it('does not show award description', () => {
    const award = createAward({funded: false});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    const expected = getAward('Cosmic Settler').description;
    expect(wrapper.text()).to.not.include(expected);
  });

  const showScoresRuns = [
    {value: undefined, expected: true},
    {value: true, expected: true},
    {value: false, expected: false},
  ] as const;
  for (const run of showScoresRuns) {
    it('Show scores ' + run.value, () => {
      const award = createAward({funded: true, scores: [{playerColor: 'red', playerScore: 2}]});
      const wrapper = mount(Award, {localVue: getLocalVue(), propsData: {award, showScores: run.value}});

      expect(wrapper.find('[data-test=player-score]').exists()).to.eq(run.expected);
    });
  }

  it('colors player score', () => {
    const award = createAward({
      funded: true,
      scores: [
        {playerColor: 'red', playerScore: 2},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award, showScores: true},
    });

    const scoreWrapper = wrapper.find('[data-test=player-score]');
    expect(scoreWrapper.classes()).to.includes(`player_bg_color_${award.scores[0].playerColor}`);
  });

  it('shows sorted players scores', () => {
    const award = createAward({
      funded: false,
      scores: [
        {playerColor: 'red', playerScore: 2},
        {playerColor: 'blue', playerScore: 4},
        {playerColor: 'yellow', playerScore: 0},
        {playerColor: 'green', playerScore: 4},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award, showScores: true},
    });

    const scores = wrapper.findAll('[data-test=player-score]')
      .wrappers.map((scoreWrapper) => parseInt(scoreWrapper.text()));

    expect(scores).to.be.deep.eq([4, 4, 2, 0]);
  });

  it('shows player cube if award is funded', () => {
    const award = createAward({funded: true});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find(`.board-cube--${award.playerColor}`).exists()).to.be.true;
  });

  it('creates correct css class from award name', () => {
    const award = createAward({funded: true});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find('.ma-name--cosmic-settler').exists()).to.be.true;
  });
});
