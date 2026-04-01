import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GlobalParameterValue from '@/client/components/GlobalParameterValue.vue';

describe('GlobalParameterValue', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GlobalParameterValue, {
      ...globalConfig,
      props: {
        param: 'temperature',
        value: -30,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
