import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import Help from '@/client/components/help/Help.vue';

describe('Help', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Help, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
