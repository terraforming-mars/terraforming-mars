import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import LogGenerationList from '@/client/components/logpanel/LogGenerationList.vue';

describe('LogGenerationList', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(LogGenerationList, {
      ...globalConfig,
      props: {
        max: 3,
        selected: 2,
        lastSoloGeneration: 3,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('mounts without errors when lastSoloGeneration is absent', () => {
    const wrapper = shallowMount(LogGenerationList, {
      ...globalConfig,
      props: {
        max: 3,
        selected: 2,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
