import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardPanel from '@/client/components/logpanel/CardPanel.vue';

describe('CardPanel', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardPanel, {
      localVue: getLocalVue(),
      propsData: {
        message: undefined,
        players: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
