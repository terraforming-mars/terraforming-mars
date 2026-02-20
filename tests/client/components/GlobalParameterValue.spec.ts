import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import GlobalParameterValue from '@/client/components/GlobalParameterValue.vue';

describe('GlobalParameterValue', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GlobalParameterValue, {
      localVue: getLocalVue(),
      propsData: {
        param: 'temperature',
        value: -30,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
