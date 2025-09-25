
import {shallowMount, mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import Awards from '@/client/components/Awards.vue';
import Award from '@/client/components/Award.vue';
import {FundedAwardModel} from '@/common/models/FundedAwardModel';
import {AWARD_COSTS} from '@/common/constants';
import {AwardName} from '@/common/ma/AwardName';
import {getAward} from '@/client/MilestoneAwardManifest';
import {Preferences} from '@/client/utils/PreferencesManager';

const names: Array<AwardName> = ['Banker', 'Celebrity'];
function createAward({id = 1, funded = false}): FundedAwardModel {
  return {
    name: names[id - 1],
    playerName: funded ? 'Foo' : undefined,
    playerColor: funded ? 'red': undefined,
    scores: [],
  };
}

const PreferencesManagerWithLernerModeOn = {
  loadBoolean: () => true,
};

describe('Awards', () => {
  it('shows passed awards', () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {awards},
    });

    wrapper.findAllComponents(Award).wrappers.forEach((awardWrapper, i) => {
      expect(awardWrapper.props('award')).to.be.deep.eq(awards[i]);
    });
  });

  it('awards start showing their details', async () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards,
      },
    });

    expect(
      wrapper.findAllComponents(Award).wrappers.every((awardWrapper) => awardWrapper.isVisible()),
    ).to.be.true;
  });

  it('hide award details on click', async () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {awards},
    });

    await wrapper.find('[data-test=toggle-awards]').trigger('click');

    expect(
      wrapper.findAllComponents(Award).wrappers.every((awardWrapper) => !awardWrapper.isVisible()),
    ).to.be.true;
  });

  it('award details are hidden if they were previously hidden', async () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: awards,
        preferences: {
          show_award_details: false,
        } as Readonly<Preferences>,
      },
    });

    expect(
      wrapper.findAllComponents(Award).wrappers.every((awardWrapper) => !awardWrapper.isVisible()),
    ).to.be.true;
  });

  it('shows funded awards', () => {
    const fundedAward = createAward({id: 1, funded: true});
    const notFundedAward = createAward({id: 2, funded: false});

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [fundedAward, notFundedAward],
      },
    });

    const fundedAwards = wrapper.find('[data-test=funded-awards]');
    expect(fundedAwards.text()).to.include(fundedAward.name);
    expect(fundedAwards.text()).to.not.include(notFundedAward.name);

    const playerCube = fundedAwards.find(`[data-test-player-cube=${fundedAward.playerColor}]`);
    expect(playerCube.exists()).to.be.true;
  });

  it('shows award spot prices if learner mode is on', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    expect(wrapper.find('[data-test=spot-price]').exists()).to.be.true;
  });

  it('shows correct spot prices if no awards are funded', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    const prices = wrapper.findAll('[data-test=spot-price]')
      .wrappers.map((priceWrapper) => parseInt(priceWrapper.text()));

    expect(prices).to.be.deep.eq(AWARD_COSTS);
  });

  it('shows correct spot prices if one award is funded', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: true}),
          createAward({id: 2, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    const prices = wrapper.findAll('[data-test=spot-price]')
      .wrappers.map((priceWrapper) => parseInt(priceWrapper.text()));

    expect(prices).to.be.deep.eq([AWARD_COSTS[1], AWARD_COSTS[2]]);
  });

  it('shows correct spot prices if two awards are funded', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: true}),
          createAward({id: 2, funded: true}),
          createAward({id: 3, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    const prices = wrapper.findAll('[data-test=spot-price]')
      .wrappers.map((priceWrapper) => parseInt(priceWrapper.text()));

    expect(prices).to.be.deep.eq([AWARD_COSTS[2]]);
  });

  it('shows correct spot prices if three awards are funded', () => {
    const PreferencesManager = {
      loadBoolean: () => true,
    };

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: true}),
          createAward({id: 2, funded: true}),
          createAward({id: 3, funded: true}),
          createAward({id: 4, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager};
      },
    });

    expect(wrapper.find('[data-test=spot-price]').exists()).to.be.false;
  });

  it('shows Awards with hidden scores', () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {awards, showScores: false},
    });

    wrapper.findAllComponents(Award).wrappers.forEach((awardWrapper) => {
      expect(awardWrapper.props('showScores')).to.be.false;
    });
  });

  it('shows Awards with scores', () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {awards, showScores: true},
    });

    wrapper.findAllComponents(Award).wrappers.forEach((awardWrapper) => {
      expect(awardWrapper.props('showScores')).to.be.true;
    });
  });

  it('shows award descriptions on click', async () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];
    const wrapper = mount(Awards, {
      localVue: getLocalVue(),
      propsData: {awards, showScores: true},
    });

    const award0Description = getAward(awards[0].name).description;
    const award1Description = getAward(awards[1].name).description;
    expect(wrapper.text()).to.not.include(award0Description);
    expect(wrapper.text()).to.not.include(award1Description);

    await wrapper.find('[data-test=toggle-description]').trigger('click');

    expect(wrapper.text()).to.include(award0Description);
    expect(wrapper.text()).to.include(award1Description);

    await wrapper.find('[data-test=toggle-description]').trigger('click');

    expect(wrapper.text()).to.not.include(award0Description);
    expect(wrapper.text()).to.not.include(award1Description);
  });
});
