import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import PopupPanel from '@/client/components/common/PopupPanel.vue';

describe('PopupPanel', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PopupPanel, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
