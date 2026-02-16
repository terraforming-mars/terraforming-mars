import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardPanel from '@/client/components/logpanel/CardPanel.vue';

describe('CardPanel', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardPanel, {
      ...globalConfig,
      props: {
        message: undefined,
        players: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
