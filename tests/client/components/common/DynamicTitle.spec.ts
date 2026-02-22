import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';

describe('DynamicTitle', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(DynamicTitle, {
      localVue: getLocalVue(),
      propsData: {
        title: 'Test Title',
        color: 'blue',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
