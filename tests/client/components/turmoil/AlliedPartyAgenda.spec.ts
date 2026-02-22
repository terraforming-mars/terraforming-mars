import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import AlliedPartyAgenda from '@/client/components/turmoil/AlliedPartyAgenda.vue';

describe('AlliedPartyAgenda', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(AlliedPartyAgenda, {
      localVue: getLocalVue(),
      propsData: {
        id: 'mfp01',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
