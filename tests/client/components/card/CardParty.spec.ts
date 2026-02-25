import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardParty from '@/client/components/card/CardParty.vue';

describe('CardParty', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardParty, {
      ...globalConfig,
      props: {
        party: 'Mars First',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
