import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import Award from '@/client/components/Award.vue';
import {FundedAwardModel} from '@/models/FundedAwardModel';
import {Color} from '@/Color';

function createAward(
  {funded, scores = []}:
  {funded: boolean, scores?: FundedAwardModel['scores']},
): FundedAwardModel {
  return {
    award: {
      name: `Award name`,
      description: `Award description`,
      getScore: () => 0,
    },
    player_name: funded ? 'Foo' : '',
    player_color: funded ? 'red': '',
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

    expect(wrapper.text()).to.includes(award.award.name);
  });

  it(`doesn't show award's description`, () => {
    const award = createAward({funded: false});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.text()).to.not.includes(award.award.description);
  });

  it(`shows award's description on click`, async () => {
    const award = createAward({funded: false});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    await wrapper.trigger('click');

    expect(wrapper.text()).to.include(award.award.description);
  });

  it(`doesn't show scores`, () => {
    const award = createAward({
      funded: true,
      scores: [
        {playerColor: Color.RED, playerScore: 2},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find('[data-test=player-score]').exists()).to.be.false;
  });

  it(`shows scores if showScores is passed`, () => {
    const award = createAward({
      funded: true,
      scores: [
        {playerColor: Color.RED, playerScore: 2},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award, showScores: true},
    });

    expect(wrapper.find('[data-test=player-score]').exists()).to.be.true;
  });

  it(`colors player's score`, () => {
    const award = createAward({
      funded: true,
      scores: [
        {playerColor: Color.RED, playerScore: 2},
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
        {playerColor: Color.RED, playerScore: 2},
        {playerColor: Color.BLUE, playerScore: 4},
        {playerColor: Color.YELLOW, playerScore: 0},
        {playerColor: Color.GREEN, playerScore: 4},
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

  it(`shows player's cube if award is funded`, () => {
    const award = createAward({funded: true});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find(`.board-cube--${award.player_color}`).exists()).to.be.true;
  });

  it(`creates correct css class from award's name`, () => {
    const award = createAward({funded: true});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find('.ma-name--award-name').exists()).to.be.true;
  });
});
