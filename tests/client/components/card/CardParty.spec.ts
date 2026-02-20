import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardParty from '@/client/components/card/CardParty.vue';

describe('CardParty', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardParty, {
      localVue: getLocalVue(),
      propsData: {
        party: 'Mars First',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
