import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';

describe('DynamicTitle', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(DynamicTitle, {
      ...globalConfig,
      props: {
        title: 'Test Title',
        color: 'blue',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
