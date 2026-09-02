import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import MoonGlobalParameterValue from '@/client/components/moon/MoonGlobalParameterValue.vue';
import {MoonModel} from '@/common/models/MoonModel';
import {MAXIMUM_HABITAT_RATE, MAXIMUM_LOGISTIC_RATE, MAXIMUM_MINING_RATE} from '@/common/constants';

const moonData: MoonModel = {
  habitatRate: 1,
  logisticRate: 2,
  miningRate: 3,
  spaces: [],
};

describe('MoonGlobalParameterValue', () => {
  it('shows colony rate', () => {
    const wrapper = mount(MoonGlobalParameterValue, {
      ...globalConfig,
      props: {moonData},
    });

    expect(wrapper.text()).to.include(moonData.habitatRate);
  });

  it('shows logistic rate', () => {
    const wrapper = mount(MoonGlobalParameterValue, {
      ...globalConfig,
      props: {moonData},
    });

    expect(wrapper.text()).to.include(moonData.logisticRate);
  });

  it('shows mining rate', () => {
    const wrapper = mount(MoonGlobalParameterValue, {
      ...globalConfig,
      props: {moonData},
    });

    expect(wrapper.text()).to.include(moonData.miningRate);
  });

  it('Does not show any rating if every rating is on its max (or above)', () => {
    const moonData: MoonModel = {
      habitatRate: MAXIMUM_HABITAT_RATE,
      logisticRate: MAXIMUM_LOGISTIC_RATE + 1,
      miningRate: MAXIMUM_MINING_RATE + 2,
      spaces: [],
    };

    const wrapper = mount(MoonGlobalParameterValue, {
      ...globalConfig,
      props: {moonData},
    });

    expect(wrapper.text()).to.not.include.oneOf([
      MAXIMUM_HABITAT_RATE,
      MAXIMUM_LOGISTIC_RATE + 1,
      MAXIMUM_MINING_RATE + 2,
    ]);
  });

  it('shows completed-checkmark if every of rate is its on max (or above)', () => {
    const moonData: MoonModel = {
      habitatRate: MAXIMUM_HABITAT_RATE + 2,
      logisticRate: MAXIMUM_LOGISTIC_RATE + 1,
      miningRate: MAXIMUM_MINING_RATE,
      spaces: [],
    };

    const wrapper = mount(MoonGlobalParameterValue, {
      ...globalConfig,
      props: {moonData},
    });

    expect(wrapper.find('[data-test="completed-checkmark"]').exists()).to.be.true;
  });

  it('does not show completed-checkmark if any of rate is under its max', () => {
    const cases: Array<MoonModel> = [
      {
        habitatRate: MAXIMUM_HABITAT_RATE - 1,
        logisticRate: MAXIMUM_LOGISTIC_RATE,
        miningRate: MAXIMUM_MINING_RATE,
        spaces: [],
      },
      {
        habitatRate: MAXIMUM_HABITAT_RATE,
        logisticRate: MAXIMUM_LOGISTIC_RATE - 1,
        miningRate: MAXIMUM_MINING_RATE,
        spaces: [],
      },
      {
        habitatRate: MAXIMUM_HABITAT_RATE,
        logisticRate: MAXIMUM_LOGISTIC_RATE,
        miningRate: MAXIMUM_MINING_RATE - 1,
        spaces: [],
      },
    ];

    cases.forEach((moonData) => {
      const wrapper = mount(MoonGlobalParameterValue, {
        ...globalConfig,
        props: {moonData},
      });

      expect(wrapper.find('[data-test="completed-checkmark"]').exists()).to.be.false;
    });
  });
});
