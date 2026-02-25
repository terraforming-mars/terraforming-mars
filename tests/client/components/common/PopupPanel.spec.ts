import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PopupPanel from '@/client/components/common/PopupPanel.vue';

describe('PopupPanel', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PopupPanel, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
