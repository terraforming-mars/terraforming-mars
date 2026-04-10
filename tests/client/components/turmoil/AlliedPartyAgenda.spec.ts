import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import AlliedPartyAgenda from '@/client/components/turmoil/AlliedPartyAgenda.vue';

describe('AlliedPartyAgenda', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(AlliedPartyAgenda, {
      ...globalConfig,
      props: {
        id: 'mfp01',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
